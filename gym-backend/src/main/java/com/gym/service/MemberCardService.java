package com.gym.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.entity.MemberCard;
import com.gym.mapper.MemberCardMapper;
import org.springframework.stereotype.Service;

@Service
public class MemberCardService extends ServiceImpl<MemberCardMapper, MemberCard> {
}
