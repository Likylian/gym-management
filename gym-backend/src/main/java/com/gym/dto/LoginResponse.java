package com.gym.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String username;
    private String nickname;
    private String avatar;

    public LoginResponse(String token, String username, String nickname, String avatar) {
        this.token = token;
        this.username = username;
        this.nickname = nickname;
        this.avatar = avatar;
    }
}
