package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("product")
public class Product {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String coverImage;
    private BigDecimal price;
    private String category;
    private String tags;
    private Integer sales;
    private Integer stock;
    private Integer status;
    private String description;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
