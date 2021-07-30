# simple-tx-sender

一个简单的基于Web3的封装, 供调用基于Ethereum的链上合约接口.

只提供两个方法: 

* call: 调用合约的非view方法, 立即返回, 不等待确认.
* query: 调用合约的view方法

参考示例`examples/test.ts`.