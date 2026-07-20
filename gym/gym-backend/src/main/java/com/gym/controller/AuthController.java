package com.gym.controller;

import com.gym.dto.LoginRequest;
import com.gym.dto.LoginResponse;
import com.gym.dto.Result;
import com.gym.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = adminService.login(request);
        return Result.success(response);
    }

    @GetMapping("/info")
    public Result<Object> info() {
        return Result.success(null);
    }
}
