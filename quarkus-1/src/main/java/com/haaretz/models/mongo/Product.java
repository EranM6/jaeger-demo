package com.haaretz.models.mongo;

import java.util.Date;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    private int prodNum;
    private int statusInt;
    private String status;
    private Boolean isTrial;
    private Date startDate;
    private Date endDate;
    private int saleCode;
    private int promotionNum;
    private int debtAmount;
    private List<Map<String, ?>> abuse;

}
