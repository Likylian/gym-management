package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/private-slots")
public class PrivateSlotController {

    @Autowired
    private PrivateSlotService slotService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MemberCardService memberCardService;

    // 每小时一个时段，共 12 个
    private static final String[] TIME_TEMPLATES = {
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00", "19:00", "20:00"
    };

    /**
     * 查询某课程某日期的所有时段。没有则自动生成。
     */
    @GetMapping
    public Result<List<PrivateSlot>> list(
            @RequestParam Long courseId,
            @RequestParam String date) {
        LocalDate slotDate = LocalDate.parse(date);
        LambdaQueryWrapper<PrivateSlot> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PrivateSlot::getPrivateCourseId, courseId)
               .eq(PrivateSlot::getSlotDate, slotDate)
               .orderByAsc(PrivateSlot::getSlotTime);
        List<PrivateSlot> list = slotService.list(wrapper);
        if (list.isEmpty()) {
            // 自动生成 12 个时段
            list = new ArrayList<>();
            for (String time : TIME_TEMPLATES) {
                PrivateSlot s = new PrivateSlot();
                s.setPrivateCourseId(courseId);
                s.setSlotDate(slotDate);
                s.setSlotTime(time);
                s.setStatus(1);   // 默认可约
                s.setCreateTime(LocalDateTime.now());
                list.add(s);
            }
            slotService.saveBatch(list);
        }
        // 按时间排序
        list.sort(Comparator.comparing(PrivateSlot::getSlotTime));
        return Result.success(list);
    }

    /**
     * 预约时段：写 booking + 标 slot 状态 = 0 + 可选会员卡扣次/扣余额
     */
    @PostMapping("/{slotId}/book")
    public Result<Booking> bookSlot(
            @PathVariable Long slotId,
            @RequestBody Map<String, Object> payload) {
        PrivateSlot slot = slotService.getById(slotId);
        if (slot == null) return Result.error(404, "时段不存在");
        if (slot.getStatus() == 0) return Result.error(400, "该时段已被预约");

        // 会员卡支付：先扣次/扣余额
        Object memberCardIdObj = payload.get("memberCardId");
        if (memberCardIdObj != null) {
            Long memberCardId = Long.valueOf(String.valueOf(memberCardIdObj));
            MemberCard card = memberCardService.getById(memberCardId);
            if (card == null) return Result.error(404, "会员卡不存在");
            if (card.getStatus() == null || card.getStatus() != 1) {
                return Result.error(400, "会员卡已失效");
            }
            String phone = (String) payload.getOrDefault("phone", "");
            if (StringUtils.hasText(phone) && StringUtils.hasText(card.getPhone())
                    && !phone.equals(card.getPhone())) {
                return Result.error(403, "会员卡不属于该用户");
            }
            if (card.getExpireTime() != null && card.getExpireTime().isBefore(LocalDateTime.now())) {
                return Result.error(400, "会员卡已过期");
            }
            if ("次卡".equals(card.getCardType())) {
                int remain = card.getRemainTimes() != null ? card.getRemainTimes() : 0;
                if (remain < 1) return Result.error(400, "剩余次数不足");
                card.setRemainTimes(remain - 1);
            } else if ("储值".equals(card.getCardType()) || "储值卡".equals(card.getCardType())) {
                BigDecimal balance = card.getBalance() != null ? card.getBalance() : BigDecimal.ZERO;
                BigDecimal price = new BigDecimal(payload.getOrDefault("price", "800").toString());
                if (balance.compareTo(price) < 0) return Result.error(400, "余额不足");
                card.setBalance(balance.subtract(price));
            }
            memberCardService.updateById(card);
        }

        // 1) 写 booking
        Booking booking = new Booking();
        booking.setCourseName("[私教] " + payload.getOrDefault("courseName", "私教课程"));
        booking.setMemberName((String) payload.getOrDefault("memberName", "微信用户"));
        booking.setPhone((String) payload.getOrDefault("phone", ""));
        booking.setPeople(1);
        booking.setCourseTime(slot.getSlotDate() + " " + slot.getSlotTime() + ":00");
        booking.setCoach((String) payload.getOrDefault("coach", ""));
        booking.setRemark((String) payload.getOrDefault("remark", ""));
        booking.setStatus("已预约");
        booking.setBookingTime(LocalDateTime.now());
        booking.setCreateTime(LocalDateTime.now());

        // 会员卡信息
        if (memberCardIdObj != null) {
            MemberCard card = memberCardService.getById(Long.valueOf(String.valueOf(memberCardIdObj)));
            booking.setMemberCard(card.getCardName());
            booking.setMemberCardId(card.getId());
        }

        bookingService.save(booking);

        // 2) 标 slot 已约
        slot.setStatus(0);
        slot.setBookedBy(1L);                  // TODO: 真实 member id
        slot.setBookingId(booking.getId());
        slotService.updateById(slot);

        return Result.success(booking);
    }
}
