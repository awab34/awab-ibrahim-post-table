import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import { Input, Space, Table, Typography, Button, Flex } from "antd";
import axios from "axios";
const { Search } = Input;
const { Title } = Typography;
const columns = [
  {
    title: "Body",
    dataIndex: "body",
    key: "body",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "UserId",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
];

const App = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [tablePageIndex, settablePageIndex] = useState(1);
  const [numberOfTableElements, setnumberOfTableElements] = useState(100);
  const [pageSizeOfTable, setpageSizeOfTable] = useState(10);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_start=0&_limit=10")
      .then((response) => {
        setListOfPosts(response.data);
        settablePageIndex(1);
      });
  }, []);
  const onResetButtonClick = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_start=0&_limit=10")
      .then((response) => {
        setnumberOfTableElements(100);
        setpageSizeOfTable(10);
        settablePageIndex(1);
        setListOfPosts(response.data);
      });
  };
  const onSearch = (value) => {
    axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
      let lastResult = [];
      if (value.match(/[^0-9]/) == null && value != "") {
        response.data.forEach((element) => {
          if (element.userId == value) {
            lastResult.push(element);
          }
          if (element.id == value) {
            if (!lastResult.includes(element)) {
              lastResult.push(element);
            }
          }
        });
      }
      response.data.forEach((element) => {
        var regex = new RegExp(value, "g");
        if (element.title.match(regex) != null) {
          if (!lastResult.includes(element)) {
            lastResult.push(element);
          }
        }

        if (element.body.match(regex) != null) {
          if (!lastResult.includes(element)) {
            lastResult.push(element);
          }
        }
      });
      console.log(lastResult);
      setpageSizeOfTable(lastResult.length);
      setnumberOfTableElements(lastResult.length);
      setListOfPosts(lastResult);
    });
  };

  return (
    <Space direction="vertical">
      <Typography>
        <Title type="success" style={{ textAlign: "center" }}>
          Posts Table
        </Title>
      </Typography>
      <Flex gap="small" wrap>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
        <Button type="primary" onClick={onResetButtonClick}>
          Reset
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={listOfPosts}
        pagination={{
          current: tablePageIndex,
          defaultPageSize: 10,
          pageSize: pageSizeOfTable,
          total: numberOfTableElements,
          onShowSizeChange: (current, pageSize) => {
            let numberOfElements = pageSize * current;
            let i = 0;
            let newPageIndex = 0;
            while (i <= 100) {
              i = i + pageSize;
              newPageIndex = newPageIndex + 1;
              if (numberOfElements <= i) {
                break;
              }
            }
            let start = (newPageIndex - 1) * pageSize;
            axios
              .get(
                `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${pageSize}`
              )
              .then((response) => {
                setnumberOfTableElements(100);
                setpageSizeOfTable(pageSize);
                console.log(response.data);
                setListOfPosts(response.data);
              });
          },
          onChange: (page, pageSize) => {
            let numberOfElements = pageSize * page;
            let i = 0;
            let newPageIndex = 0;
            while (i <= 100) {
              i = i + pageSize;
              newPageIndex = newPageIndex + 1;
              if (numberOfElements <= i) {
                break;
              }
            }
            let start = (newPageIndex - 1) * pageSize;
            axios
              .get(
                `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${pageSize}`
              )
              .then((response) => {
                setnumberOfTableElements(100);
                setpageSizeOfTable(pageSize);
                settablePageIndex(newPageIndex);
                setListOfPosts(response.data);
              });
          },
        }}
      />
    </Space>
  );
};
export default App;
