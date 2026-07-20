package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.MemberCard;
import com.gym.service.MemberCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member-cards")
public class MemberCardController {

    @Autowired
    private MemberCardService memberCardService;

    @GetMapping
    public Result<Page<MemberCard>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        Page<MemberCard> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<MemberCard> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(MemberCard::getCardName, keyword)
                   .or().like(MemberCard::getPhone, keyword);
        }
        if (status != null) wrapper.eq(MemberCard::getStatus, status);
        wrapper.orderByDesc(MemberCard::getCreateTime);
        return Result.success(memberCardService.page(page, wrapper));
    }

    @PostMapping
    public Result<Void> add(@RequestBody MemberCard card) {
        memberCardService.save(card);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody MemberCard card) {
        card.setId(id);
        memberCardService.updateById(card);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        memberCardService.removeById(id);
        return Result.success();
    }
}
