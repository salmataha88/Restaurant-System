import Order from '../../../DB/models/order.js'
import Table from '../../../DB/models/table.js'
import Product from '../../../DB/models/product.js'
import e from 'express';

export const createOrder = async (req, res) => {
  const {items , table , paymentMethod} = req.body;
  if(!items || items.length === 0|| !table ){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }
  const selectedTable = await Table.findById(table);
  if(!selectedTable){
    return res.status(400).json({
      message : "table not found"
    })
  }
  if(selectedTable.status !== "available"){
    return res.status(400).json({
      message : "Table is not available"
    })
  }

  let totalAmount = 0;
  for(let i = 0; i < items.length; i++){
    const item = items[i];
    const product = await Product.findById(item);
    console.log(product);
    
    if(!product){
      return res.status(400).json({
        message : "product not found"
      })
    }
    if(product.quantity < item.quantity){
      return res.status(400).json({
        message : "product quantity is not enough"
      })
    }
    product.quantity--;
    console.log( "P: " , product.quantity , product.price);

    totalAmount += product.price;
    await product.save();
  }
  console.log(totalAmount);
  const newOrder = new Order({
    items,
    table,
    totalAmount,
    paymentMethod,
  });
  
  await newOrder.save();

  selectedTable.status = "occupied";
  await selectedTable.save();
  
  return res.status(200).json({
    message : "order created successfully",
    newOrder,
  });
};

export const completeOrder = async (req, res) => {
  const { orderId , paymentMethod} = req.body;
  if(!orderId){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }
  const order = await Order.findOne({orderId});
  if(!order){
    return res.status(400).json({
      message : "order not found"
    })
  }
  if(order.status === "paid"){
    return res.status(400).json({
      message : "order already completed"
    })
  }
  order.status = "paid";
  if(paymentMethod){
    order.paymentMethod = paymentMethod;
  }
  order.updatedAt = new Date();
  await order.save();

  const table = await Table.findById(order.table);
  table.status = "available";
  await table.save();

  return res.status(200).json({
    message : "order completed successfully",
    order,
  });
};

export const updateOrder = async (req, res) => {
  const updates = req.body; //items , paymentMethod , table , status
  const {orderId} = req.params; 

  console.log(updates , orderId);
  

  if(!orderId || !updates){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }

  const order = await Order.findOne({orderId});
  if(!order){
    return res.status(400).json({
      message : "order not found"
    })
  }
  if (!['pending','preparing' , 'ready' , 'delivered' , 'paid'].includes(order.status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  if(order.status === "paid"){
    return res.status(400).json({
      message : "Cannot update completed order"
    })
  }

  if(updates.table){
    const selectedTable = await Table.findById(updates.table);
    if(!selectedTable){
      return res.status(400).json({
        message : "table not found"
      })
    }
    if(selectedTable.status !== "available"){
      return res.status(400).json({
        message : "Table is not available"
      })
    }
    selectedTable.status = "occupied";
    await selectedTable.save();

    const table = await Table.findById(order.table);
    table.status = "available";
    await table.save();
  }

  if(updates.items){
    var totalAmount = 0;
    const items = updates.items;

    for(let i = 0; i < items.length; i++){
      const item = items[i];
      const product = await Product.findById(item);
      console.log(product);

      if(!product){
        return res.status(400).json({
          message : "product not found"
        })
      }

      if(product.quantity < item.quantity){
        return res.status(400).json({
          message : "product quantity is not enough"
        })
      }
      product.quantity--;
      console.log( "P: " , product.quantity , product.price);
      await product.save();

      if(product.quantity === 0){
        product.inStock = false;
        await product.save();
      }
      totalAmount += product.price;
    }
  }

  const newOrder = await Order.findByIdAndUpdate({orderId}, {
    $set : {
      ...updates,
      totalAmount : totalAmount,
      updatedAt :new Date(),
    }
  });

  return res.status(200).json({
    message : "order updated successfully", newOrder
  });
};

export const updateOrderStatus = async (req, res) => {
  const { orderId , status} = req.params;
  
  if(!orderId || !status){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }
  
  const order = await Order.findOne({orderId});
  if(!order){
    return res.status(400).json({
      message : "order not found"
    })
  }

  if (!['pending','preparing' , 'ready' , 'delivered' , 'paid'].includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  if(order.status === "paid"){
    return res.status(400).json({
      message : "order already completed"
    })
  }

  order.status = status;
  order.updatedAt = new Date();
  await order.save();

  return res.status(200).json({
    message : "order status updated successfully"
  });
}

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  if(!orderId){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }
  const order = await Order.findOne({orderId});
  if(!order){
    return res.status(400).json({
      message : "order not found"
    })
  }
  if(order.status !== "pending"){
    return res.status(400).json({
      message : "Cannot delete order"
    })
  }

  await order.deleteOne();

  const table = await Table.findById(order.table);
  table.status = "available";
  await table.save();

  return res.status(200).json({
    message : "order deleted successfully"
  });
}

export const getOrders = async (req, res) => {
  const orders = await Order.find();
  if(!orders || orders.length === 0){
    return res.status(400).json({
      message : "No Orders found"
    })
  }
  return res.status(200).json({
    orders,
  });
}

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  if(!orderId){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }
  const order = await Order.findOne({orderId});
  if(!order){
    return res.status(400).json({
      message : "order not found"
    })
  }
  return res.status(200).json({
    order,
  });
}

export const getOrderOfTable = async (req, res) => {
  const { table } = req.params;
  if(!table){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }

  const order = await Order.find({table , status: {$ne: "paid"}});
  

  if(!order || order.length === 0){
    return res.status(400).json({
      message : "No Order found"
    })
  }
  return res.status(200).json({
    order,
  });
}

export const getOrdersByStatus = async (req, res) => {
  const { status } = req.params;
  if(!status){
    return res.status(400).json({
      message : "please provide all the required fields"
    })
  }
  if (!['pending','preparing' , 'ready' , 'delivered' , 'paid'].includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }
  const orders = await Order.find({status});
  if(!orders || orders.length === 0){
    return res.status(400).json({
      message : "No Orders found"
    })
  }
  return res.status(200).json({
    orders});
}