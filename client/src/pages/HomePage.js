// import important dependencies
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { Modal, Form, Select, message, Table, Input, DatePicker } from 'antd';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';
const { RangePicker } = DatePicker;
// arrow function
const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransaction, setAllTransaction] = useState([]);
    const [frequency, setFrequency] = useState('365');
    const [selectedDate, setSelectedate] = useState([]);
    const [type, setType] = useState('all');
    const [viewData, setViewData] = useState('table');
    const [editable, setEditable] = useState(null)
    //table data
    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Reference",
            dataIndex: "reference",
        },
        {
            title: "Actions",
            render: (text, record) => (
                <div>
                    <EditOutlined onClick={() => {
                        setEditable(record);
                        setShowModal(true);
                    }} />
                    <DeleteOutlined className='mx-2' onClick={()=>{handleDelete(record);}}/>
                </div>
            )
        },
    ];

    //UseEffect Hook
    useEffect(() => {
        //get all transactions
        const getAllTransactions = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'))
                setLoading(true)
                const res = await axios.post('/transactions/get-transaction', {
                    userid: user._id,
                    frequency,
                    selectedDate,
                    type
                });
                setLoading(false)
                setAllTransaction(res.data)
                console.log(res.data)
            } catch (error) {
                console.log(error);
                message.error('fetch issues with transaction')
            }

        };
        getAllTransactions();
    }, [frequency, selectedDate, type]);

    //delete handler
    const handleDelete = async(record)=>{
        try{
            setLoading(true)
            await axios.post('/transactions/delete-transaction', {transactionId:record._id})
            setLoading(false)
            message.success('Transaction deleted')
            Reloadpage(true)
        }catch(error){
            setLoading(false)
            console.log(error)
            message.error('unable to delete')
        }
    };

    //Form handling
    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setLoading(true)
            if (editable) {
                await axios.post('/transactions/edit-transaction', { 
                    payload:{
                        ...values,
                        userid:user._id
                    },
                    transactionId:editable._id
                 });
                setLoading(false)
                message.success('Transaction updated successfully')
            } else {
                await axios.post('/transactions/add-transaction', { ...values, userid: user._id })
                setLoading(false)
                message.success('Transaction added successfully')
            }
            setShowModal(false)
            setEditable(null)
        } catch (error) {
            setLoading(false)
            message.error('Failed to add transaction')
        }
    };
    //Auto refresh 
    function Reloadpage(e){
        window.location.reload();
    }
    return (

        <Layout>
            {loading && <Spinner />}
            <div className='filters'>
                <div>
                    <h6>select frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value='7'>Last 1 week</Select.Option>
                        <Select.Option value='30'>Last 1 Month</Select.Option>
                        <Select.Option value='365'>Last 1 year</Select.Option>
                        <Select.Option value='custom'>Custom</Select.Option>

                    </Select>
                    {frequency === 'custom' && <RangePicker value={selectedDate}
                        onChange={(values) => setSelectedate(values)} />}
                </div>
                <div>
                    <h6>select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value='all'>All</Select.Option>
                        <Select.Option value='income'>Income</Select.Option>
                        <Select.Option value='expense'>Expense</Select.Option>

                    </Select>
                    {frequency === 'custom' && <RangePicker value={selectedDate}
                        onChange={(values) => setSelectedate(values)} />}
                </div>
                <div className='switch-icons'>
                    <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'} `}
                        onClick={() => setViewData('table')} />
                    <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'} `} onClick={() => setViewData('analytics')} />
                </div>
                <div>

                    <button className='btn btn-primary' onClick={() => setShowModal(true)}>Add new</button>
                </div>

            </div>
            <div className='content'>
                {viewData === 'table' ? (<Table columns={columns} dataSource={allTransaction} />)

                    : (<Analytics allTransaction={allTransaction} />)
                }
            </div>

            <Modal title={editable ? 'Edit Transaction' : 'Add Transaction'}
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={false}
            >
                <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
                    <Form.Item label="Amount" name="amount">
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item label="type" name="type">
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Date" name="date">
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item label="Reference" name="reference">
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input type="text" />
                    </Form.Item>

                    <div className='d-flex justify-content-end'>
                        <button type="submit" className='btn btn-primary' onClick={Reloadpage}>
                            {" "}
                            SAVE
                        </button>
                    </div>
                </Form>
            </Modal>
        </Layout>


    );
};

export default HomePage;