package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("private_slot")
public class PrivateSlot {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long privateCourseId;
    private LocalDate slotDate;
    private String slotTime;
    private Integer status;        // 1=可约, 0=已约/不可约
    private Long bookedBy;         // member.id
    private Long bookingId;
    private LocalDateTime createTime;
}
