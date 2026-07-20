package com.gym.dto;

import com.gym.entity.Member;
import lombok.Data;

@Data
public class MemberLoginResponse {
    private String token;
    private Member member;

    public MemberLoginResponse(String token, Member member) {
        this.token = token;
        this.member = member;
    }
}
