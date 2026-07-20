package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gym.dto.Result;
import com.gym.entity.CardProduct;
import com.gym.entity.CardSpec;
import com.gym.entity.Member;
import com.gym.entity.MemberCard;
import com.gym.service.CardProductService;
import com.gym.service.CardSpecService;
import com.gym.service.MemberCardService;
import com.gym.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/card-products")
public class CardProductController {

    @Autowired
    private CardProductService cardProductService;

    @Autowired
    private CardSpecService cardSpecService;

    @Autowired
    private MemberCardService memberCardService;

    @Autowired
    private MemberService memberService;

    /**
     * 列出所有卡（可按 type 过滤）
     */
    @GetMapping
    public Result<List<CardProduct>> list(@RequestParam(required = false) String type) {
        LambdaQueryWrapper<CardProduct> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(type)) wrapper.eq(CardProduct::getCardType, type);
        wrapper.eq(CardProduct::getStatus, 1);
        wrapper.orderByAsc(CardProduct::getSort);
        List<CardProduct> list = cardProductService.list(wrapper);
        // 给每个卡填上 specs
        for (CardProduct cp : list) {
            LambdaQueryWrapper<CardSpec> specWrapper = new LambdaQueryWrapper<>();
            specWrapper.eq(CardSpec::getCardProductId, cp.getId());
            specWrapper.orderByAsc(CardSpec::getSort);
            List<CardSpec> specs = cardSpecService.list(specWrapper);
            cp.setSpecs(specs);
        }
        return Result.success(list);
    }

    /**
     * 详情（带 specs）
     */
    @GetMapping("/{id}")
    public Result<CardProduct> detail(@PathVariable Long id) {
        CardProduct cp = cardProductService.getById(id);
        if (cp == null) return Result.error(404, "卡不存在");
        LambdaQueryWrapper<CardSpec> specWrapper = new LambdaQueryWrapper<>();
        specWrapper.eq(CardSpec::getCardProductId, id);
        specWrapper.orderByAsc(CardSpec::getSort);
        cp.setSpecs(cardSpecService.list(specWrapper));
        return Result.success(cp);
    }

    /**
     * 购买：写 member_card
     */
    @PostMapping("/{id}/purchase")
    public Result<MemberCard> purchase(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        CardProduct cp = cardProductService.getById(id);
        if (cp == null) return Result.error(404, "卡不存在");

        Long specId = Long.valueOf(String.valueOf(payload.get("specId")));
        CardSpec spec = cardSpecService.getById(specId);
        if (spec == null) return Result.error(404, "规格不存在");

        Long memberId = Long.valueOf(String.valueOf(payload.getOrDefault("memberId", "0")));
        Member member = memberId > 0 ? memberService.getById(memberId) : null;

        MemberCard mc = new MemberCard();
        mc.setCardName(cp.getName());
        mc.setMemberId(member != null ? member.getId() : null);
        mc.setMemberName(member != null ? member.getNickname() : (String) payload.getOrDefault("memberName", ""));
        mc.setPhone((String) payload.getOrDefault("phone", member != null ? member.getPhone() : ""));
        mc.setCardType(cp.getCardType());
        mc.setTimes(spec.getTimes() != null ? spec.getTimes() : (cp.getTimes() != null ? cp.getTimes() : 1));
        mc.setRemainTimes(mc.getTimes());
        mc.setBalance(spec.getPrice());                    // 购买金额
        mc.setDays(spec.getDays() != null ? spec.getDays() : (cp.getDays() != null ? cp.getDays() : 0));
        mc.setStatus(1);
        if (mc.getDays() != null && mc.getDays() > 0) {
            mc.setExpireTime(LocalDateTime.now().plusDays(mc.getDays()));
        }
        mc.setCreateTime(LocalDateTime.now());
        mc.setUpdateTime(LocalDateTime.now());
        memberCardService.save(mc);

        return Result.success(mc);
    }
}
