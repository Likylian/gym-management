package com.gym.service.impl;

import com.gym.entity.CardProduct;
import com.gym.mapper.CardProductMapper;
import com.gym.service.CardProductService;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

@Service
public class CardProductServiceImpl extends ServiceImpl<CardProductMapper, CardProduct> implements CardProductService {
}
