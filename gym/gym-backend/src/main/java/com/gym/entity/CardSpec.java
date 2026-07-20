package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;

@Data
@TableName("card_spec")
public class CardSpec {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long cardProductId;
    private String label;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer days;
    private Integer times;
    private Integer sort;
}
