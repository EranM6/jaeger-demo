package com.haaretz.models.mongo;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.haaretz.interfaces.MongoResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.net.util.SubnetUtils;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class University implements MongoResponse {
    @JsonProperty("_id")
    private Double id;
    private String name;
    private String displayName;
    private String description;
    private Set<String> ranges;
    private Set<Ip> ips;
    private Contact contact;
    private Sites sites;

    private static Pattern rangePattern = Pattern.compile("^\\d+\\.\\d+\\.\\d+\\.\\d+/\\d+$");
    private static Pattern ipPattern = Pattern.compile("^\\d+\\.\\d+\\.\\d+\\.\\d+$");

    public void generateIps() {
        Set<Ip> ips = new HashSet<>();
        ranges.forEach(range -> {
            if (rangePattern.matcher(range).matches()) {
                if (range.endsWith("/32")) {
                    range = range.split("/")[0];
                    ips.add(University.Ip.builder()
                            .firstIp(ipToDec(range))
                            .lastIp(ipToDec(range))
                            .build()
                    );
                } else {
                    SubnetUtils.SubnetInfo netInfo = new SubnetUtils(range).getInfo();
                    ips.add(University.Ip.builder()
                            .firstIp(ipToDec(netInfo.getLowAddress()))
                            .lastIp(ipToDec(netInfo.getHighAddress()))
                            .build()
                    );
                }
            } else if (ipPattern.matcher(range).matches()) {
                ips.add(University.Ip.builder()
                        .firstIp(ipToDec(range))
                        .lastIp(ipToDec(range))
                        .build()
                );
            } else {
                throw new RuntimeException(String.format("[%s] Is not a range nor an IP", range));
            }
        });

        setIps(ips);
    }

    private double ipToDec(String ipAddress) {
        String[] ipAddressInArray = ipAddress.split("\\.");

        long result = 0;
        for (int i = 0; i < ipAddressInArray.length; i++) {

            int power = 3 - i;
            int ip = Integer.parseInt(ipAddressInArray[i]);
            result += ip * Math.pow(256, power);

        }

        return result;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Ip {
        private double firstIp;
        private double lastIp;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Contact {
        private String name;
        private String description;
        private String phone;
        private String email;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Sites {
        private boolean htz;
        private boolean tm;
        private boolean hdc;
    }
}
