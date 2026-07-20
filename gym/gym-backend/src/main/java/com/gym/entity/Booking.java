package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("booking")
public class Booking {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String courseName;
    private String memberName;
    private String phone;
    private Integer people;
    private String courseTime;
    private String coach;
    private String memberCard;
    private String remark;
    private String status;
    private LocalDateTime bookingTime;
    private LocalDateTime createTime;
}
