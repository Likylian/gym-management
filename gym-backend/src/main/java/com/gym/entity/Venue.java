package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("venue")
public class Venue {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String phone;
    private String address;
    private String email;
    private Integer sort;
    private Integer status;
    private String description;
    private String coverImage;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
