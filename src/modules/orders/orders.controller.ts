import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderQueryDto } from './dto/order-query.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create Order',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.ordersService.create({
      ...createOrderDto,
      customerId: req.user.sub,
    });
  }

  @ApiOperation({ summary: 'Find Orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders were found successfully',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @ApiOperation({ summary: 'Find Order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order Founded',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'update order details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order Update',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    return this.ordersService.update({
      id,
      updateOrderDto,
      customerId: req.user.sub,
    });
  }
}
