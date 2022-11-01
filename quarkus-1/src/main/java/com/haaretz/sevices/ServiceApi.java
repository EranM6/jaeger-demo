package com.haaretz.sevices;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.smallrye.health.api.AsyncHealthCheck;
import io.smallrye.mutiny.Uni;
import org.apache.http.HeaderElement;
import org.apache.http.HeaderElementIterator;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectionKeepAliveStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.LaxRedirectStrategy;
import org.apache.http.message.BasicHeaderElementIterator;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.health.HealthCheckResponse;

public abstract class ServiceApi<T> implements AsyncHealthCheck {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Uni<HealthCheckResponse> call() {
        return Uni.createFrom().item(HealthCheckResponse.named(String.format("%s connection health check", getServiceName())))
                .onItem().transform(response -> {
                    try {
                        checkConnection();
                        response.up();
                    } catch (IllegalStateException | IOException e) {
                        response.down().withData("error", e.getMessage());
                    }

                    return response.build();
                });
    }

    abstract String getServiceName();

    private String getUrl() {
         return ConfigProvider.getConfig().getValue(String.format("utils.%s.url", getServiceName()), String.class);
    }

    protected String getEndpoint(String path) {
        return String.format("%s/%s", getUrl(), path);
    }

    protected Map<String, String> getHeaders() {
         return new HashMap<>() {{
            put(HttpHeaders.CONTENT_TYPE, "application/json");
        }};
    }

    public String getHealthUrl() {
        return String.format("%s/%s", getUrl(), ConfigProvider.getConfig().getValue(String.format("utils.%s.health", getServiceName()), String.class));
    }

    protected HttpClient getClient() {
        int timeout = 10;
        RequestConfig config = RequestConfig.custom()
                .setConnectTimeout(timeout * 1000)
                .setConnectionRequestTimeout(timeout * 1000)
                .build();

        ConnectionKeepAliveStrategy keepAliveStrategy = (response, context) -> {
            HeaderElementIterator it = new BasicHeaderElementIterator(response.headerIterator(HTTP.CONN_KEEP_ALIVE));
            while (it.hasNext()) {
                HeaderElement he = it.nextElement();
                String param = he.getName();
                String value = he.getValue();
                if (value != null && param.equalsIgnoreCase("timeout")) {
                    return Long.parseLong(value) * 1000;
                }
            }
            return 5 * 1000;
        };

        return HttpClientBuilder.create()
                .setRedirectStrategy(new LaxRedirectStrategy())
                .setKeepAliveStrategy(keepAliveStrategy)
                .setDefaultRequestConfig(config)
                .setRetryHandler(new DefaultHttpRequestRetryHandler(1, false))
                .build();
    }

    public void checkConnection() throws IOException {
        HttpResponse response = getClient().execute(new HttpGet(getHealthUrl()));
        if (response.getStatusLine().getStatusCode() > 200) {
            throw new IOException(response.getStatusLine().getReasonPhrase());
        }
    }

    protected HttpResponse fetch(String url) throws IOException {
        HttpGet httpGet = new HttpGet(url);

        for (Map.Entry<String, String> entry : getHeaders().entrySet()) {
            httpGet.setHeader(entry.getKey(), entry.getValue());
        }

        return getClient().execute(httpGet);
    }

    protected String post(String url, T object) throws IOException {
        HttpPost httpPost = new HttpPost(url);

        for (Map.Entry<String, String> entry : getHeaders().entrySet()) {
            httpPost.setHeader(entry.getKey(), entry.getValue());
        }

        if (object != null) {
            httpPost.setEntity(new StringEntity(objectMapper.writeValueAsString(object), StandardCharsets.UTF_8));
        }

        HttpResponse response = getClient().execute(httpPost);
        HttpEntity entity = response.getEntity();
        int status = response.getStatusLine().getStatusCode();
        return EntityUtils.toString(entity);
    }
}
