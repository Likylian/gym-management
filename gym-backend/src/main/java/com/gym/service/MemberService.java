package com.gym.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.entity.Member;
import com.gym.mapper.MemberMapper;
import org.springframework.stereotype.Service;

@Service
public class MemberService extends ServiceImpl<MemberMapper, Member> {
}
