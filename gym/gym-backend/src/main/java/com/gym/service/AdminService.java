package com.gym.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.config.JwtUtils;
import com.gym.dto.LoginRequest;
import com.gym.dto.LoginResponse;
import com.gym.entity.Admin;
import com.gym.mapper.AdminMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService extends ServiceImpl<AdminMapper, Admin> {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        Admin admin = getOne(new LambdaQueryWrapper<Admin>()
                .eq(Admin::getUsername, request.getUsername()));
        if (admin == null) {
            throw new RuntimeException("用户名不存在");
        }
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        String token = jwtUtils.generateToken(admin.getUsername());
        return new LoginResponse(token, admin.getUsername(), admin.getNickname(), admin.getAvatar());
    }
}
