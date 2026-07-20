package com.gym.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.config.JwtUtils;
import com.gym.dto.MemberLoginRequest;
import com.gym.dto.MemberLoginResponse;
import com.gym.entity.Member;
import com.gym.mapper.MemberMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MemberService extends ServiceImpl<MemberMapper, Member> {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SmsService smsService;

    public MemberLoginResponse login(MemberLoginRequest request) {
        String phone = request.getPhone();
        String code = request.getCode();
        if (phone == null || !phone.matches("^1[3-9]\\d{9}$")) {
            throw new RuntimeException("手机号格式不正确");
        }
        if (code == null || !code.matches("^\\d{6}$")) {
            throw new RuntimeException("验证码格式不正确");
        }
        if (!smsService.verify(phone, code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        Member member = getOne(new LambdaQueryWrapper<Member>().eq(Member::getPhone, phone));
        // 未注册则自动创建
        if (member == null) {
            member = new Member();
            member.setPhone(phone);
            member.setAccount(phone);
            member.setNickname("用户" + phone.substring(7));
            member.setStatus(1);
            member.setPoints(0);
            member.setRegisterTime(LocalDateTime.now());
            member.setUpdateTime(LocalDateTime.now());
            save(member);
        } else if (member.getStatus() != null && member.getStatus() == 0) {
            throw new RuntimeException("账户已被禁用");
        }

        String token = jwtUtils.generateToken(phone);
        return new MemberLoginResponse(token, member);
    }
}
