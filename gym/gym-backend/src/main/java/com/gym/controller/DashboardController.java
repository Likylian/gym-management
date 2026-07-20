package com.gym.controller;

import com.gym.dto.Result;
import com.gym.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private MemberService memberService;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private GroupCourseService groupCourseService;
    @Autowired
    private PrivateCourseService privateCourseService;
    @Autowired
    private MemberCardService memberCardService;

    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        Map<String, Object> data = new HashMap<>();
        data.put("todayRevenue", 1000);
        data.put("yesterdayRevenue", 0);
        data.put("todayNewMembers", 0);
        data.put("yesterdayNewMembers", 0);
        data.put("totalMembers", memberService.count());
        data.put("todayCourses", 0);
        data.put("yesterdayCourses", 0);
        data.put("totalGroupCourses", groupCourseService.count());
        data.put("totalPrivateCourses", privateCourseService.count());
        data.put("totalMemberCards", memberCardService.count());

        // 今日课程列表
        List<Map<String, String>> todaySchedule = new ArrayList<>();
        String[] times = {"09:30", "10:30", "11:30", "12:30", "14:00", "15:00", "16:00", "18:00", "19:00"};
        String[] coaches = {"阿豪教练", "小美教练", "大壮教练", "晓峰教练"};
        String[] courses = {"减脂训练", "增肌课程", "瑜伽课", "普拉提", "拳击训练", "核心训练"};
        Random rand = new Random(42);
        for (String time : times) {
            Map<String, String> item = new HashMap<>();
            item.put("time", time);
            item.put("coach", coaches[rand.nextInt(coaches.length)]);
            item.put("course", courses[rand.nextInt(courses.length)]);
            todaySchedule.add(item);
        }
        data.put("todaySchedule", todaySchedule);

        // 最新办卡
        List<Map<String, Object>> latestCards = new ArrayList<>();
        String[] cardNames = {"月卡", "季卡", "年卡", "次卡(10次)", "私教课包(20次)"};
        for (int i = 0; i < 5; i++) {
            Map<String, Object> card = new HashMap<>();
            card.put("cardName", cardNames[i]);
            card.put("memberName", "会员" + (i + 1));
            card.put("createTime", "2024-01-" + String.format("%02d", 20 - i) + " 13:12");
            latestCards.add(card);
        }
        data.put("latestCards", latestCards);

        return Result.success(data);
    }

    @GetMapping("/sales")
    public Result<Map<String, Object>> sales() {
        Map<String, Object> data = new HashMap<>();
        String[] dates = {"01-14", "01-15", "01-16", "01-17", "01-18", "01-19", "01-20"};
        List<Integer> shopSales = Arrays.asList(1200, 800, 1500, 2000, 1800, 2200, 1600);
        List<Integer> courseSales = Arrays.asList(3000, 2500, 4000, 3500, 5000, 4500, 3800);
        data.put("dates", Arrays.asList(dates));
        data.put("shopSales", shopSales);
        data.put("courseSales", courseSales);
        return Result.success(data);
    }
}
