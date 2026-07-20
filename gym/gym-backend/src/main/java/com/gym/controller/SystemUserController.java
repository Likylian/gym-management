package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.SystemUser;
import com.gym.service.SystemUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system/users")
public class SystemUserController {

    @Autowired
    private SystemUserService systemUserService;

    @GetMapping
    public Result<Page<SystemUser>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword) {
        Page<SystemUser> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SystemUser> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) wrapper.like(SystemUser::getUsername, keyword).or().like(SystemUser::getNickname, keyword);
        return Result.success(systemUserService.page(page, wrapper));
    }

    @PostMapping
    public Result<Void> add(@RequestBody SystemUser user) {
        systemUserService.save(user);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody SystemUser user) {
        user.setId(id);
        systemUserService.updateById(user);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        systemUserService.removeById(id);
        return Result.success();
    }
}
