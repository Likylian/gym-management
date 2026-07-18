package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.Member;
import com.gym.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping
    public Result<Page<Member>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String memberLevel) {
        Page<Member> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Member> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Member::getNickname, keyword)
                   .or().like(Member::getPhone, keyword)
                   .or().like(Member::getAccount, keyword);
        }
        if (StringUtils.hasText(memberLevel)) {
            wrapper.eq(Member::getMemberLevel, memberLevel);
        }
        wrapper.orderByDesc(Member::getRegisterTime);
        return Result.success(memberService.page(page, wrapper));
    }

    @GetMapping("/{id}")
    public Result<Member> getById(@PathVariable Long id) {
        return Result.success(memberService.getById(id));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Member member) {
        member.setId(id);
        memberService.updateById(member);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        memberService.removeById(id);
        return Result.success();
    }
}
