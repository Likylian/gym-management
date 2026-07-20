package com.gym.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.entity.Coach;
import com.gym.mapper.CoachMapper;
import org.springframework.stereotype.Service;

@Service
public class CoachService extends ServiceImpl<CoachMapper, Coach> {
}
