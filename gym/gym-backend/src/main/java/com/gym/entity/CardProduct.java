package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("card_product")
public class CardProduct {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String cardType;
    private String coverColor;
    private BigDecimal basePrice;
    private BigDecimal originalPrice;
    private Integer times;
    private BigDecimal balance;
    private Integer days;
    private String supportedVenues;
    private String description;
    private Integer status;
    private Integer sort;
    private LocalDateTime createTime;

    // 非数据库字段：关联的规格（控制器里手动填充）
    @TableField(exist = false)
    private List<CardSpec> specs;
}
