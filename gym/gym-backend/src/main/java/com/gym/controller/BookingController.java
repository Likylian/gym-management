package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.Booking;
import com.gym.entity.MemberCard;
import com.gym.entity.PrivateSlot;
import com.gym.service.BookingService;
import com.gym.service.MemberCardService;
import com.gym.service.PrivateSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PrivateSlotService slotService;

    @Autowired
    private MemberCardService memberCardService;

    @GetMapping
    public Result<Page<Booking>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        Page<Booking> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Booking> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            // 按 课程名 / 用户名 / 手机号 任一匹配
            wrapper.and(w -> w.like(Booking::getCourseName, keyword)
                    .or().like(Booking::getMemberName, keyword)
                    .or().like(Booking::getPhone, keyword));
        }
        if (StringUtils.hasText(status)) wrapper.eq(Booking::getStatus, status);
        wrapper.orderByDesc(Booking::getBookingTime);
        return Result.success(bookingService.page(page, wrapper));
    }

    @PostMapping
    public Result<Booking> create(@RequestBody Booking booking) {
        if (booking.getBookingTime() == null) booking.setBookingTime(LocalDateTime.now());
        if (booking.getCreateTime() == null) booking.setCreateTime(LocalDateTime.now());
        if (booking.getStatus() == null) booking.setStatus("已预约");
        if (booking.getPeople() == null || booking.getPeople() < 1) booking.setPeople(1);

        // 会员卡支付：先校验 + 扣次/扣余额
        if (booking.getMemberCardId() != null) {
            MemberCard card = memberCardService.getById(booking.getMemberCardId());
            if (card == null) return Result.error(404, "会员卡不存在");
            if (card.getStatus() == null || card.getStatus() != 1) {
                return Result.error(400, "会员卡已失效");
            }
            // 必须匹配手机号
            if (StringUtils.hasText(booking.getPhone())
                    && StringUtils.hasText(card.getPhone())
                    && !booking.getPhone().equals(card.getPhone())) {
                return Result.error(403, "会员卡不属于该用户");
            }
            // 过期校验
            if (card.getExpireTime() != null && card.getExpireTime().isBefore(LocalDateTime.now())) {
                return Result.error(400, "会员卡已过期");
            }
            int people = booking.getPeople() != null ? booking.getPeople() : 1;

            // 次卡：扣 remainTimes
            if ("次卡".equals(card.getCardType())) {
                int remain = card.getRemainTimes() != null ? card.getRemainTimes() : 0;
                if (remain < people) return Result.error(400, "剩余次数不足");
                card.setRemainTimes(remain - people);
            }
            // 储值卡：扣 balance（按课程价 × 人数）
            else if ("储值".equals(card.getCardType()) || "储值卡".equals(card.getCardType())) {
                BigDecimal balance = card.getBalance() != null ? card.getBalance() : BigDecimal.ZERO;
                // 估算所需金额：booking 价（如未传，用 people*50 默认价）
                BigDecimal need = estimatePrice(booking);
                if (balance.compareTo(need) < 0) return Result.error(400, "余额不足");
                card.setBalance(balance.subtract(need));
            }
            // 期限卡：仅校验，不扣值（已经在过期校验里过）
            memberCardService.updateById(card);
            // 同步 booking.memberCard 为卡名（显示用）
            booking.setMemberCard(card.getCardName());
        }

        bookingService.save(booking);
        return Result.success(booking);
    }

    private BigDecimal estimatePrice(Booking b) {
        // 简单估算：次卡不调，储值卡按 people * 50
        int people = b.getPeople() != null ? b.getPeople() : 1;
        return new BigDecimal(50).multiply(new BigDecimal(people));
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
        if (booking == null) return Result.error(404, "预约不存在");
        if ("已取消".equals(booking.getStatus())) return Result.error(400, "已取消，请勿重复操作");
        booking.setStatus("已取消");
        bookingService.updateById(booking);

        // 私教预约：还原 private_slot 状态
        LambdaQueryWrapper<PrivateSlot> slotWrapper = new LambdaQueryWrapper<>();
        slotWrapper.eq(PrivateSlot::getBookingId, id);
        PrivateSlot slot = slotService.getOne(slotWrapper);
        if (slot != null) {
            // MyBatis-Plus 的 updateById 默认忽略 null 字段
            // 用 UpdateWrapper 显式置 null，booked_by / booking_id 才能真正清空
            UpdateWrapper<PrivateSlot> uw = new UpdateWrapper<>();
            uw.eq("id", slot.getId());
            uw.set("status", 1);
            uw.set("booked_by", null);
            uw.set("booking_id", null);
            slotService.update(uw);
        }
        return Result.success();
    }
}
