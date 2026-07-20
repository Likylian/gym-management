package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.Result;
import com.gym.entity.Product;
import com.gym.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Result<Page<Product>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer status) {
        Page<Product> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) wrapper.like(Product::getName, keyword);
        if (StringUtils.hasText(category)) wrapper.eq(Product::getCategory, category);
        if (status != null) wrapper.eq(Product::getStatus, status);
        wrapper.orderByDesc(Product::getCreateTime);
        return Result.success(productService.page(page, wrapper));
    }

    @GetMapping("/stats")
    public Result<Object> stats() {
        long total = productService.count();
        long online = productService.count(new LambdaQueryWrapper<Product>().eq(Product::getStatus, 1));
        long offline = productService.count(new LambdaQueryWrapper<Product>().eq(Product::getStatus, 0));
        return Result.success(java.util.Map.of("total", total, "online", online, "offline", offline));
    }

    @PostMapping
    public Result<Void> add(@RequestBody Product product) {
        productService.save(product);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        productService.updateById(product);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        productService.removeById(id);
        return Result.success();
    }
}
