package com.gym.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.entity.Product;
import com.gym.mapper.ProductMapper;
import org.springframework.stereotype.Service;

@Service
public class ProductService extends ServiceImpl<ProductMapper, Product> {
}
