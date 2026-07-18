package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.GroupCourse;
import com.gym.service.GroupCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/group-courses")
public class GroupCourseController {

    @Autowired
    private GroupCourseService groupCourseService;

    @GetMapping
    public Result<Page<GroupCourse>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String name) {
        Page<GroupCourse> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<GroupCourse> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(name)) {
            wrapper.like(GroupCourse::getName, name);
        }
        wrapper.orderByAsc(GroupCourse::getSort);
        return Result.success(groupCourseService.page(page, wrapper));
    }

    @PostMapping
    public Result<Void> add(@RequestBody GroupCourse course) {
        groupCourseService.save(course);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody GroupCourse course) {
        course.setId(id);
        groupCourseService.updateById(course);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        groupCourseService.removeById(id);
        return Result.success();
    }
}
