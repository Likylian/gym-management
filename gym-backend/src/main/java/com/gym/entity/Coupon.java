package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("coupon")
public class Coupon {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String type;
    private BigDecimal amount;
    private BigDecimal minAmount;
    private Integer total;
    private Integer used;
    private Integer status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createTime;
}
