package com.gym.dto;

import lombok.Data;

@Data
public class MemberLoginRequest {
    private String phone;
    private String code;
}
