import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { Modal, Input, Form, Select, DatePicker, Table, Popconfirm } from 'antd';
import axios from 'axios';
import Spinner from './Spinner';
import moment from 'moment';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Analytics from '../components/Analytics';

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);
         const user = JSON.parse(localStorage.getItem('user'));

  const getAllTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (frequency === "custom" && selectedDate.length !== 2) {
        toast.warning("Please select a valid date range");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/transaction/get-transaction", {
        userId: user.id,
        frequency,
        selectedDate: selectedDate.map(date => date.toISOString()),
        type
      });
      const sortedTransactions = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllTransaction(sortedTransactions)
    } catch (error) {
      toast.error("Issue with transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, [frequency, selectedDate, type]);

  const handleSubmit = async (value) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        
        await axios.post('http://localhost:5000/api/transaction/edit-transaction', {
          ...value,
          userId: user.id,
          _id: editable._id,
          date: value.date.toISOString(),
        });
        toast.success('Transaction updated');
      } else {
                //alert(`UserId is ${user.id}`)

        await axios.post('http://localhost:5000/api/transaction/add-transaction', {
          ...value,
          userId:user.id,
          date: value.date.toISOString(),
        });
        toast.success('Transaction added');
      }
      form.resetFields();
      setShowModal(false);
      setEditable(null);
      getAllTransaction();
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/transaction/delete-transaction', {
        transactionId: record._id,
      });
      toast.success('Transaction deleted');
      getAllTransaction();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => moment(text).format('DD/MM/YY'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => `₹ ${value.toLocaleString()}`,
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="d-flex gap-2">
          <EditOutlined
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => {
              setEditable(record);
              setShowModal(true);
              form.setFieldsValue({
                ...record,
                date: moment(record.date),
              });
            }}
          />
          <Popconfirm
            title="Are you sure to delete this transaction?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {loading && <Spinner />}
      <ToastContainer position="top-center" />

      {/* Filters */}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(value) => setFrequency(value)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="360">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values || [])}
            />
          )}
        </div>

        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(value) => setType(value)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>

        <div className="switch-icons" style={{ border: "1px solid black" }}>
          <UnorderedListOutlined
            className={viewData === 'table' ? 'active-icon' : 'inactive-icon'}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}
            onClick={() => setViewData("analytics")}
          />
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditable(null);
              setShowModal(true);
              form.resetFields();
            }}
            disabled={loading}
          >
            Add New
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="content">
        {viewData === 'table' ? (
          <Table
            columns={columns}
            dataSource={allTransaction}
            rowKey={(record) => record._id || record.reference}
          />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      {/* Modal Section */}
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditable(null);
        }}
        footer={false}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YY" className="w-100" />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {editable ? "Update" : "Save"}
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
