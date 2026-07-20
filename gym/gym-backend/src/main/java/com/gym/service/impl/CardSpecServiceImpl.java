package com.gym.service.impl;

import com.gym.entity.CardSpec;
import com.gym.mapper.CardSpecMapper;
import com.gym.service.CardSpecService;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

@Service
public class CardSpecServiceImpl extends ServiceImpl<CardSpecMapper, CardSpec> implements CardSpecService {
}
