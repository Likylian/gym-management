package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("group_course")
public class GroupCourse {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String coach;
    private String coverImage;
    private Integer sort;
    private Integer duration;
    private Integer maxPeople;
    private String tags;
    private String description;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
