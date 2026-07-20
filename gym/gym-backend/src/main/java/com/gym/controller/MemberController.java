package com.gym.controller;

import com.gym.dto.MemberLoginRequest;
import com.gym.dto.MemberLoginResponse;
import com.gym.dto.Result;
import com.gym.service.MemberService;
import com.gym.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private SmsService smsService;

    /** 发送验证码（开发环境直接返回 code 方便调试） */
    @PostMapping("/send-code")
    public Result<String> sendCode(@RequestBody java.util.Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || !phone.matches("^1[3-9]\\d{9}$")) {
            return Result.error("手机号格式不正确");
        }
        String code = smsService.generateAndStore(phone);
        return Result.success(code);
    }

    @PostMapping("/login")
    public Result<MemberLoginResponse> login(@RequestBody MemberLoginRequest request) {
        return Result.success(memberService.login(request));
    }

    @GetMapping("/info")
    public Result<Object> info() {
        return Result.success(null);
    }
}
