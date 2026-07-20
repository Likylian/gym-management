package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("member_card")
public class MemberCard {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String cardName;
    private Long memberId;
    private String memberName;
    private String phone;
    private String cardType;
    private Integer times;
    private Integer remainTimes;
    private BigDecimal balance;
    private Integer days;
    private Integer status;
    private LocalDateTime expireTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
