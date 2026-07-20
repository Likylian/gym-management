package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.PrivateCourse;
import com.gym.service.PrivateCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/private-courses")
public class PrivateCourseController {

    @Autowired
    private PrivateCourseService privateCourseService;

    @GetMapping
    public Result<Page<PrivateCourse>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String coach) {
        Page<PrivateCourse> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<PrivateCourse> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(name)) wrapper.like(PrivateCourse::getName, name);
        if (StringUtils.hasText(coach)) wrapper.like(PrivateCourse::getCoach, coach);
        wrapper.orderByAsc(PrivateCourse::getSort);
        return Result.success(privateCourseService.page(page, wrapper));
    }

    @GetMapping("/all")
    public Result<java.util.List<PrivateCourse>> all() {
        return Result.success(privateCourseService.list());
    }

    @GetMapping("/{id}")
    public Result<PrivateCourse> detail(@PathVariable Long id) {
        return Result.success(privateCourseService.getById(id));
    }

    @PostMapping
    public Result<Void> add(@RequestBody PrivateCourse course) {
        privateCourseService.save(course);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody PrivateCourse course) {
        course.setId(id);
        privateCourseService.updateById(course);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        privateCourseService.removeById(id);
        return Result.success();
    }
}
