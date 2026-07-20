package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.Booking;
import com.gym.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public Result<Page<Booking>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        Page<Booking> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Booking> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) wrapper.like(Booking::getCourseName, keyword).or().like(Booking::getMemberName, keyword);
        if (StringUtils.hasText(status)) wrapper.eq(Booking::getStatus, status);
        wrapper.orderByDesc(Booking::getBookingTime);
        return Result.success(bookingService.page(page, wrapper));
    }

    @PostMapping
    public Result<Booking> create(@RequestBody Booking booking) {
        if (booking.getBookingTime() == null) booking.setBookingTime(java.time.LocalDateTime.now());
        if (booking.getCreateTime() == null) booking.setCreateTime(java.time.LocalDateTime.now());
        if (booking.getStatus() == null) booking.setStatus("已预约");
        if (booking.getPeople() == null || booking.getPeople() < 1) booking.setPeople(1);
        bookingService.save(booking);
        return Result.success(booking);
    }

    @PostMapping("/{id}/checkin")
    public Result<Void> checkin(@PathVariable Long id) {
        Booking booking = bookingService.getById(id);
        booking.setStatus("已签到");
        bookingService.updateById(booking);
        return Result.success();
    }

    @PostMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        Booking booking = bookingService.getById(id);
        booking.setStatus("已取消");
        bookingService.updateById(booking);
        return Result.success();
    }
}
