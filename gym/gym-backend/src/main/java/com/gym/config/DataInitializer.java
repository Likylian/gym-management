package com.gym.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gym.entity.Admin;
import com.gym.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 确保管理员密码正确加密
        Admin admin = adminService.getOne(new LambdaQueryWrapper<Admin>().eq(Admin::getUsername, "admin"));
        if (admin != null) {
            admin.setPassword(passwordEncoder.encode("admin123"));
            adminService.updateById(admin);
            System.out.println(">>> 管理员密码已更新 (admin / admin123)");
        }
    }
}
