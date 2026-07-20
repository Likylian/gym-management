package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("coach")
public class Coach {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String gender;
    private String phone;
    private String avatar;
    private String venueIds;
    private String venueNames;
    private Integer sort;
    private Integer status;
    private String description;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
