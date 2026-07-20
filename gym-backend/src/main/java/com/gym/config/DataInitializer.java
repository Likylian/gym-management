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
        // 仅在 admin 账号不存在时才创建，已存在则不做任何修改（密码由数据库已有数据为准）
        Admin admin = adminService.getOne(new LambdaQueryWrapper<Admin>().eq(Admin::getUsername, "admin"));
        if (admin == null) {
            Admin newAdmin = new Admin();
            newAdmin.setUsername("admin");
            newAdmin.setPassword(passwordEncoder.encode("admin123"));
            newAdmin.setNickname("管理员");
            newAdmin.setStatus(1);
            adminService.save(newAdmin);
            System.out.println(">>> 初始化管理员账号 (admin / admin123)");
        } else {
            System.out.println(">>> 管理员账号已存在，跳过初始化 (数据库已锁定该账号)");
        }
    }
}
