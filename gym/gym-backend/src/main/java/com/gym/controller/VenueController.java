package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.Venue;
import com.gym.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    @Autowired
    private VenueService venueService;

    @GetMapping
    public Result<Page<Venue>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword) {
        Page<Venue> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Venue> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Venue::getName, keyword).or().like(Venue::getAddress, keyword);
        }
        wrapper.orderByAsc(Venue::getSort);
        return Result.success(venueService.page(page, wrapper));
    }

    @GetMapping("/all")
    public Result<List<Venue>> all() {
        return Result.success(venueService.list());
    }

    @GetMapping("/{id}")
    public Result<Venue> detail(@PathVariable Long id) {
        return Result.success(venueService.getById(id));
    }

    @PostMapping
    public Result<Void> add(@RequestBody Venue venue) {
        venueService.save(venue);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Venue venue) {
        venue.setId(id);
        venueService.updateById(venue);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        venueService.removeById(id);
        return Result.success();
    }
}
