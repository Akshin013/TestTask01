"use client";
import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const page = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (record) => {
    setEditingItem(record);
    form.resetFields(null);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
  };

  const openAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const newItem = {
        key: editingItem ? editingItem.key : Date.now().toString(),
        name: values.name,
        date: values.date.format("YYYY-MM-DD"),
        value: values.value,
      };

      if (editingItem) {
        setData((prev) =>
          prev.map((item) => (item.key === editingItem.key ? newItem : item)),
        );
      } else {
        setData((prev) => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Дата",
      dataIndex: "date",
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Значение",
      dataIndex: "value",
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: "Действия",
      render: (_, record) => (
        <Space>
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record.key)}
            style={{ cursor: "pointer", color: "red" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <main style={{ padding: 20 }}>
      <h2>Таблица</h2>

      {/* 🔍 поиск */}
      <Input
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />

      {/* ➕ кнопка */}
      <Button
        type="primary"
        onClick={openAddModal}
        style={{ marginBottom: 16 }}
        className="ml-2"
      >
        Добавить
      </Button>

      {/* 📊 таблица */}
      <Table columns={columns} dataSource={filteredData} />

      {/* 🧾 модалка */}
      <Modal
        title={editingItem ? "Редактировать" : "Добавить"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: "Выберите дату" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="value"
            label="Значение"
            rules={[{ required: true, message: "Введите число" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};

export default page;
