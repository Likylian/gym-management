package com.gym.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("member")
public class Member {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String account;
    private String nickname;
    private String realName;
    private String phone;
    private String avatar;
    private Integer gender;
    private String memberCard;
    private String memberLevel;
    private String coach;
    private Integer points;
    private Integer status;
    private LocalDateTime registerTime;
    private LocalDateTime updateTime;
}
