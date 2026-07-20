package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.Coach;
import com.gym.service.CoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachService coachService;

    @GetMapping
    public Result<Page<Coach>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String venueIds) {
        Page<Coach> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Coach> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Coach::getName, keyword).or().like(Coach::getPhone, keyword);
        }
        if (StringUtils.hasText(venueIds)) {
            wrapper.like(Coach::getVenueIds, venueIds);
        }
        wrapper.orderByAsc(Coach::getSort);
        return Result.success(coachService.page(page, wrapper));
    }

    @PostMapping
    public Result<Void> add(@RequestBody Coach coach) {
        coachService.save(coach);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Coach coach) {
        coach.setId(id);
        coachService.updateById(coach);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        coachService.removeById(id);
        return Result.success();
    }
}
