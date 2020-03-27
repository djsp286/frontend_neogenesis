import Page from 'components/Page';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, FormGroup
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdSearch, MdAutorenew, MdEdit, MdDelete } from 'react-icons/md';


import {
    MdLoyalty,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLink'

import * as firebase from 'firebase/app';
import TambahTema from './TambahTema';
import EditTema from './EditTema';

const perf = firebase.performance();

class Tema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            currentDepart: { dept_name: '', dept_kosmetikyn: "N", dept_lokasi: 0 },
            inputtedName: '',
            currentPage: 1,
            realCurrentPage: 1,
            todosPerPage: 5,
            maxPage: 1,
            flag: 0,
            keyword: '',
            active_user_id: "10",
            loading: false,
            checked: false,
            enterButton: false
        };
    }

    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value, currentPage: 1, realCurrentPage: 1 }, () => {
            // this.getListbyPaging(1, this.state.todosPerPage, this.state.keyword);
        });
    }

    //set Current Page
    paginationButton(event, flag, maxPage = 0) {
        var currPage = Number(event.target.value);
        if ((currPage + flag) > 0 && (currPage + flag) <= maxPage) {
            this.setState({
                currentPage: (currPage + flag),
                realCurrentPage: (currPage + flag),
            }, () => {
                // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
    }

    pagination = (value, arrow, maxPage = 0) => {
        var currPage = Number(value);
        if ((currPage + arrow) > 0 && (currPage + arrow) <= maxPage) {
            this.setState({
                currentPage: (currPage + arrow),
                realCurrentPage: (currPage + arrow),
            }, () => {
                // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
        console.log("YES BISA");

    }

    enterPressedPage = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            if (this.state.currentPage > 0) {
                if (this.state.currentPage > this.state.maxPage) {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.maxPage,
                        currentPage: prevState.maxPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                } else {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.currentPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                }
            }
        }
    }

    enterPressedSearch = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.setState({ currentPage: 1, realCurrentPage: 1 }
                , () => { this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword); });
        }
    }

    showNotification = (currMessage, levelType) => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdLoyalty />,
                message:
                    currMessage,
                level: levelType,
            });
        }, 300);
    }

    getListbyPaging(currPage, currLimit, kword) {
        const trace = perf.trace('getDeptList');
        trace.start();
        const urlA = myUrl.url_getDeptListByPaging;
        var payload = {
            offset: (currPage - 1) * currLimit,
            limit: currLimit,
            keyword: kword,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }

        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }

                } else {
                    this.setState({ result: data, maxPage: data.page ? data.page : 1, loading: false });
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }
            ).then(() => { this.setState({ loading: false }) });


    }

    componentDidMount() {
        // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }


    insertMasterDept = param => () => {
        const trace = perf.trace('newDept');
        trace.start();
        const currentDepart = param;
        var url = myUrl.url_insertMasterDept;
        var lokasi = currentDepart.dept_lokasi;
        lokasi = (lokasi === 0) ? null : lokasi;

        this.fetchData();
        var payload = {
            dept_name: currentDepart.dept_name,
            dept_lokasi: lokasi,
            dept_kosmetikyn: currentDepart.dept_kosmetikyn,
            dept_userid: this.state.active_user_id
        };

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        checked: false,
                        loading: false,
                        enterButton: false
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(this.fetchData())
            ;
    }

    insertMasterDeptShortcut = param => {
        const trace = perf.trace('newDept');
        trace.start();
        const currentDepart = param;
        var url = myUrl.url_insertMasterDept;
        var lokasi = currentDepart.dept_lokasi;
        lokasi = (lokasi === 0) ? null : lokasi;
        this.setState({ enterButton: true })

        this.fetchData();
        var payload = {
            dept_name: currentDepart.dept_name,
            dept_lokasi: lokasi,
            dept_kosmetikyn: currentDepart.dept_kosmetikyn,
            dept_userid: this.state.active_user_id
        };

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        checked: false,
                        loading: false, enterButton: false
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                // this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false, enterButton: false }) });
    }

    updateDept = (first_param, second_param, third_param, event = null) => {

        const trace = perf.trace('updateDept');
        trace.start();
        var url = myUrl.url_updateDept;

        //currentButton true adalah button Edit, false adalah bbutton active/deactive
        const currentButton = (event.target.id).includes('Edit');
        const currentDepart = third_param;
        var lokasi = currentDepart.dept_lokasi;
        lokasi = (lokasi === "0") ? null : lokasi;
        this.setState({ enterButton: true })
        var payload = {};
        this.fetchData();
        if (currentButton) {
            //edit
            payload = {
                dept_name: second_param.dept_name,
                dept_lokasi: lokasi,
                dept_kosmetikyn: currentDepart.dept_kosmetikyn,
                dept_code: second_param.dept_code,
                dept_activeyn: second_param.dept_activeyn,
                dept_userid: this.state.active_user_id
            };

        } else {
            //ActiveYN
            payload =
                {
                    dept_name: second_param.dept_name,
                    dept_lokasi: second_param.dept_lokasi,
                    dept_kosmetikyn: second_param.dept_kosmetikyn,
                    dept_code: second_param.dept_code,
                    dept_activeyn: first_param,
                    dept_userid: this.state.active_user_id
                };
        }

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    if (currentButton === true) {
                        this.setState({
                            modal_nested_edit: false,
                            modal_nested_parent_edit: false,
                            checked: false,
                            loading: false,
                            enterButton: false
                        });
                    }
                    else {
                        this.setState({
                            modal_active: false,
                            modal_deactive: false,
                            loading: false,
                            enterButton: false
                        });
                    }

                    return response.json()
                }
                else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false, enterButton: false }) });
    }

    setLokasi(i = null) {
        if (i === null || i === 0) {
            return "-"
        } else if (i === 1) {

            return "Floor Atas"
        } else if (i === 2) {
            return "Floor Bawah"
        }
    }

    setKosmetik = (kosmetik) => {
        if (kosmetik === "Y") {
            return true
        } else {
            return false
        }
    }

    //modal Tambah
    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    //modal Tambah dalam tambah
    state = {
        modal_tambah: false,
        modal_backdrop_tambah: false,
        modal_nested_parent_tambah: false,
        modal_nested_tambah: false,
        backdrop: true,
    };

    //modal Edit
    state = {
        modal_edit: false,
        modal_backdrop: false,
        modal_nested_parent_edit: false,
        modal_nested_edit: false,
        editDept: {},
    }

    //modal update YN
    state = {
        modal_active: false,
        modal_deactive: false,
        active_deptcode_deactive: {},
        active_deptcode_active: {},
        modal_active_toggle: "",
        modal_deactive_toggle: "",
    };

    toggleDeactiveData = (todo) => {
        this.setState({
            modal_deactive_toggle: "deactive_toggle",
            modal_deactive: true,
            active_deptcode_deactive: todo,
        });
    }

    toggleActiveData = (todo) => {
        this.setState({
            modal_active_toggle: "active_toggle",
            modal_active: true,
            active_deptcode_active: todo,
        });
    }

    toggleEditData = (modalType, todo) => {
        if (!modalType) {
            const modal_edit = Object.assign({}, this.state.modal_edit);
            return this.setState({
                modal_edit: !modal_edit
            });
        }

        if (modalType === "nested_parent_edit") {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                editDept: todo,
                checked: (todo.dept_kosmetikyn === "Y") ? true : false,
            }, () => {
            });
        } else {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                editDept: todo,
            });
        }

    }

    toggle = modalType => (event) => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
                modal_nested: false,
                modal_nested_edit: false
            });
        }
        // if(modalType === modal_nested && modalType === modal_nested_edit)
        // {
        //     this.setState({modal_nested_parent : false, modal_nested_parent_edit : false})
        // }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`]

        }, () => {
            // if (this.state.modal_nested_parent === true) {
            //     document.getElementById("unit").focus();
            // }
        });

    };


    fetchData = () => {
        this.setState({ loading: true });
    };

    handleClose = () => {
        var resetCurrentDepart = {};
        resetCurrentDepart["dept_name"] = "";
        resetCurrentDepart["dept_lokasi"] = "";
        resetCurrentDepart["dept_kosmetikyn"] = "N";
        this.setState({ checked: false, modal_nested: false, modal_nested_edit: false, modal_nested_tambah: false, currentDepart: { ...resetCurrentDepart } });

    }
    handleCheckboxChange = (event) => {
        let currentDepart = this.state.currentDepart;
        currentDepart["dept_kosmetikyn"] = (event.target.checked ? "Y" : "N");
        this.setState({ checked: event.target.checked, currentDepart, modal_nested: false, modal_nested_edit: false, });
    }

    testFunc = (modalType) => {
        if (this.state.modal_nested_parent && this.state.modal_nested) {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                modal_nested: false
            });
        } else {
            if (!modalType) {
                return this.setState({
                    modal: !this.state.modal
                });
            }

            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

            });
        }
    }

    toggles = () => {
        this.setState({
            show: !this.state.show,
        });
    };

    render() {
        const externalCloseBtn = (
            <button
                className="close"
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '20px',
                    fontSize: '3rem',
                }}
                onClick={this.toggles}>
                &times;
            </button>
        );
        const { loading, modal_nested_parent , modal_nested_parent_edit} = this.state;
        // const currentTodos = this.state.result.result;
        const currentTodos = [
            {
                "nama_tema": "Natal",
                "outlet": "Century TA",
                "template": "Template No.1"
            },
            {
                "nama_tema": "Natal",
                "outlet": "Century CP",
                "template": "Template No.4"
            },
            {
                "nama_tema": "Halloween",
                "outlet": "Century TA",
                "template": "Template No.5"
            },
            {
                "nama_tema": "Tahun Baru",
                "outlet": "Century TA",
                "template": "Template No.2"
            },
            {
                "nama_tema": "Idul Fitri",
                "outlet": "Century CP",
                "template": "Template No.3"
            },


        ];
        const isEnabled = this.canBeSubmitted();

        const renderTodos = currentTodos && currentTodos.map((todo, i) => {
            return <tr key={i}>
                <td scope="row">{todo.nama_tema}</td>
                <td>{todo.outlet}</td>
                <td>
                    {todo.template}
                </td>

                {/* {todo.dept_activeyn === "Y" &&
                    <td>
                        <Badge color="success" className="mr-1">Aktif</Badge>
                    </td>
                }
                {todo.dept_activeyn !== "Y" &&
                    <td>
                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                    </td>
                } */}
                <td>
                    <Button style={{ margin: "0px" }} color="secondary" size="sm" onClick={() => this.toggleEditData('nested_parent_edit', todo)}><MdEdit /></Button>
                </td>

                {todo.dept_activeyn === "Y" &&
                    <td>
                        <Button color="danger" size="sm" onClick={() => this.toggleDeactiveData(todo)}><MdDelete /></Button>
                    </td>
                }
                {todo.dept_activeyn !== "Y" &&
                    <td>
                        <Button color="danger" size="sm" onClick={() => this.toggleActiveData(todo)}><MdDelete /></Button>
                    </td>
                }

            </tr>
        });

        return (
            <Page
                title="Tema"
                breadcrumbs={[{ name: 'Tema', active: true }]}
                className="Tema"
            >
                {!modal_nested_parent && !modal_nested_parent_edit && <Row>
                    <Col>
                        <Card className="mb-3">
                            <NotificationSystem
                                dismissible={false}
                                ref={notificationSystem =>
                                    (this.notificationSystem = notificationSystem)
                                }
                                style={NOTIFICATION_SYSTEM_STYLE}
                            />
                            <CardHeader className="d-flex justify-content-between">
                                <Form inline className="cr-search-form" onSubmit={e => e.preventDefault()}>
                                    <MdSearch
                                        size="20"
                                        className="cr-search-form__icon-search text-secondary"
                                    />
                                    <Input
                                        type="search"
                                        id="search"
                                        className="cr-search-form__input"
                                        placeholder="Search..."
                                        onChange={evt => this.updateSearchValue(evt)}
                                        onKeyPress={event => this.enterPressedSearch(event, true)}
                                    />
                                </Form>
                                

                                {/* Modal + Button Tambah */}
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>

                                <Modal
                                    onExit={this.handleClose}
                                    size="xl"
                                    style={{ width: "100vh", height: "100vh" }}
                                    isOpen={this.state.modal_nested_parent}
                                    toggle={this.toggle('nested_parent')}
                                    backdrop="true"
                                    backdropClassName="modal-backdrop-light"
                                    className={this.props.className}
                                    centered>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah Tema
                                    </ModalHeader>
                                    <ModalBody>
                                        <Form>
                                            <FormGroup>
                                                <Label >Nama Tema</Label>
                                                <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Nama Template" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Outlet</Label>
                                                <Input type="select" autoComplete="off" name="select" value={this.state.value} onChange={evt => this.updateInputValue(evt, "dept_lokasi")}>
                                                    <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Outlet</option>
                                                    <option>Century TA</option>
                                                    <option>Century CP</option>
                                                    <option>Century CL</option>
                                                    <option>Century Senayan City</option>
                                                    <option>Century Grand Indonesia</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Template</Label>
                                                <Input type="select" autoComplete="off" name="select" value={this.state.value} onChange={evt => this.updateInputValue(evt, "dept_lokasi")}>
                                                    <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Template</option>
                                                    <option>Template 1</option>
                                                    <option>Template 2</option>
                                                    <option>Template 3</option>
                                                    <option>Template 4</option>
                                                    <option>Template 5</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Button size="sm" onClick={this.toggle('nested_parent_tambah')} >Tambah</Button>
                                                <Modal
                                                    style={{ width: '100%', height: '100%' }}
                                                    onExit={this.handleClose}
                                                    size="md"
                                                    isOpen={this.state.modal_nested_parent_tambah}
                                                    toggle={this.toggle('nested_parent_tambah')}
                                                    className={this.props.className}
                                                    external={externalCloseBtn}
                                                    centered>
                                                    <ModalHeader toggle={this.toggle('nested_parent_tambah')}>
                                                        Tambah Deskripsi Tema
                                    </ModalHeader>
                                                    <ModalBody>
                                                        <Form>
                                                            <FormGroup>
                                                                <Label >Nama Video</Label>
                                                                <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Nama Video" />
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label >URL</Label>
                                                                <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Link URL" />
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label >Procod</Label>
                                                                <Input type="number" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Procod" />
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label >Deskripsi</Label>
                                                                <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Deskripsi" />
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label >URL Gambar</Label>
                                                                <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Link URL Gambar" />
                                                            </FormGroup>
                                                        </Form>
                                                        <br></br>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="primary" onClick={this.toggle('nested_parent_tambah')}>
                                                            Simpan
                                        </Button>
                                                        <Modal
                                                            style={{ width: '100%', height: '100%' }}
                                                            onExit={this.handleClose}
                                                            isOpen={this.state.modal_nested_edit}
                                                            toggle={this.toggle('nested_tambah')}
                                                            centered>
                                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                            <ModalBody>
                                                                Apakah Anda yakin ingin menyimpan data ini?
                                                </ModalBody>
                                                            <ModalFooter>
                                                                <Button id="btnEdit" color="primary" /*onClick={(e) => this.updateDept('Y', this.state.editDept, this.state.currentDepart, e)}*/ onClick={this.toggle('nested_parent_edit')} disabled={loading}>
                                                                    {!loading && "Ya"}
                                                                    {loading && (
                                                                        <MdAutorenew />
                                                                    )}
                                                                    {loading && "Sedang diproses"}
                                                                </Button>
                                                                {!loading && <Button
                                                                    color="secondary"
                                                                    onClick={this.toggle('nested_tambah')}>
                                                                    Tidak
                                                </Button>}
                                                            </ModalFooter>
                                                        </Modal>
                                                        <Button color="secondary" onClick={this.toggle('nested_parent_tambah')}>
                                                            Batal
                                        </Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </FormGroup>
                                            <Row>
                                                <Col>
                                                    <Card className="mb-3">
                                                        <CardBody>
                                                            <Table responsive>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Nama Video</th>
                                                                        <th>URL</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>A</td>
                                                                        <td>A</td>
                                                                    </tr>
                                                                    <tr>
                                                                        {/* <td></td>
                                                            <td></td> */}
                                                                    </tr>
                                                                    <tr>
                                                                        {/* <td></td>
                                                            <td></td> */}
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                                <Col>
                                                    <Card className="mb-3">
                                                        <CardBody>
                                                            <Table responsive>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Procod</th>
                                                                        <th>Deskripsi</th>
                                                                        <th>URL Gambar</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>B</td>
                                                                        <td>B</td>
                                                                        <td>B</td>
                                                                    </tr>
                                                                    <tr>
                                                                        {/* <td></td>
                                                            <td></td> */}
                                                                    </tr>
                                                                    <tr>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            {/* TEST */}

                                        </Form>
                                        <br></br>
                                        <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button disabled={!isEnabled} color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                            onExit={this.handleClose}
                                            isOpen={this.state.modal_nested}
                                            toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>
                                                {/* <strong>Nama Departemen: {this.state.currentDepart && this.state.currentDepart.dept_name}</strong>
                                                <br />
                                                <strong>Lokasi Departemen: {this.state.currentDepart && this.setLokasi(parseInt(this.state.currentDepart.dept_lokasi, 10))}</strong>
                                                <br />
                                                <br></br> */}
                                                Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" /*onClick={this.insertMasterDept(this.state.currentDepart)}*/ onClick={this.toggle('nested_parent')} disabled={loading}>
                                                    {!loading && "Ya"}
                                                    {loading && (
                                                        <MdAutorenew />
                                                    )}
                                                    {loading && "Sedang diproses"}
                                                </Button>{' '}
                                                {!loading && <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
                                                </Button>}
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>

                                {/* Modal Edit */}
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent_edit}
                                    toggle={this.toggle('nested_parent_edit')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                        Edit Template
                                    </ModalHeader>
                                    <ModalBody>
                                        <Form>
                                            <FormGroup>
                                                <Label >Nama Tema</Label>
                                                <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Nama Template" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Outlet</Label>
                                                <Input type="select" autoComplete="off" name="select" value={this.state.value} onChange={evt => this.updateInputValue(evt, "dept_lokasi")}>
                                                    <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Outlet</option>
                                                    <option>Century TA</option>
                                                    <option>Century CP</option>
                                                    <option>Century CL</option>
                                                    <option>Century Senayan City</option>
                                                    <option>Century Grand Indonesia</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Template</Label>
                                                <Input type="select" autoComplete="off" name="select" value={this.state.value} onChange={evt => this.updateInputValue(evt, "dept_lokasi")}>
                                                    <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Template</option>
                                                    <option>Template 1</option>
                                                    <option>Template 2</option>
                                                    <option>Template 3</option>
                                                    <option>Template 4</option>
                                                    <option>Template 5</option>
                                                </Input>
                                            </FormGroup>

                                        </Form>
                                        <br></br>
                                        <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle('nested_edit')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                            onExit={this.handleClose}
                                            isOpen={this.state.modal_nested_edit}
                                            toggle={this.toggle('nested_edit')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>

                                                {/* <strong>Nama Departemen: {this.state.editDept && this.state.editDept.dept_name}</strong>
                                                <br />
                                                <strong>Lokasi Departemen: {this.state.editDept && this.setLokasi(parseInt(this.state.editDept.dept_lokasi, 10))}</strong>
                                                <br />
                                                <br></br> */}
                                                Apakah Anda yakin ingin menyimpan data ini?
                                                </ModalBody>
                                            <ModalFooter>
                                                <Button id="btnEdit" color="primary" /*onClick={(e) => this.updateDept('Y', this.state.editDept, this.state.currentDepart, e)}*/ onClick={this.toggle('nested_parent_edit')} disabled={loading}>
                                                    {!loading && "Ya"}
                                                    {loading && (
                                                        <MdAutorenew />
                                                    )}
                                                    {loading && "Sedang diproses"}
                                                </Button>
                                                {!loading && <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested_edit')}>
                                                    Tidak
                                                </Button>}
                                            </ModalFooter>
                                        </Modal>
                                        <Button color="secondary" onClick={this.toggle('nested_parent_edit')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>


                                {/* Modal untuk Aktif no Aktif  */}
                                <Modal
                                    isOpen={this.state.modal_deactive}
                                    toggle={this.toggle('deactive')}>
                                    <ModalHeader toggle={this.toggle('deactive')}>
                                        Konfirmasi Penonaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        {/* <strong>Nama Departemen: {this.state.active_deptcode_deactive && this.state.active_deptcode_deactive.dept_name}</strong>
                                        <br />
                                        <strong>Lokasi Departemen: {this.state.active_deptcode_deactive && this.setLokasi(parseInt(this.state.active_deptcode_deactive.dept_lokasi, 10))}</strong>
                                        <br />
                                        <br></br> */}
                                        Apakah Anda yakin ingin menonaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button id="btnDeaktif" color="primary" onClick={this.toggle('deactive')} /*onClick={(e) => this.updateDept('N', this.state.active_deptcode_deactive, this.state.currentDepart, e)}*/ disabled={loading}>
                                            {!loading && "Ya"}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && "Sedang diproses"}
                                        </Button>{' '}
                                        {!loading && <Button color="secondary" onClick={this.toggle('deactive')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                    onExit={() => this.handleClose}
                                    isOpen={this.state.modal_active}
                                    toggle={this.toggle('active')}>
                                    <ModalHeader toggle={this.toggle('active')}>
                                        Konfirmasi Pengaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        {/* <strong>Nama Departemen: {this.state.active_deptcode_active && this.state.active_deptcode_active.dept_name}</strong>
                                        <br />
                                        <strong>Lokasi Departemen: {this.state.active_deptcode_active && this.setLokasi(parseInt(this.state.active_deptcode_active.dept_lokasi, 10))}</strong>
                                        <br />
                                        <br></br> */}
                                        Apakah Anda yakin ingin mengaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button id="btnAktif" color="primary" onClick={this.toggle('active')} /*onClick={(e) => this.updateDept('Y', this.state.active_deptcode_active, this.state.currentDepart, e)}*/ disabled={loading}>
                                            {!loading && "Ya"}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && "Sedang diproses"}
                                        </Button>{' '}
                                        {!loading && <Button color="secondary" onClick={this.toggle('active')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <Table responsive
                                    striped>
                                    <thead>
                                        <tr>
                                            <td colSpan='11' className="text-right" style={{ border: 'none' }}>
                                                <Label style={{ width: '50%', textAlign: 'left' }}>F1: Tambah, F3: Search</Label>
                                                <Label style={{ width: '50%', textAlign: 'right' }}> {'Halaman : ' + this.state.realCurrentPage + ' / ' + this.state.maxPage}</Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Nama Tema</th>
                                            <th>Nama Outlet</th>
                                            <th>Template</th>
                                            <th>Edit</th>
                                            <th>Hapus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTodos}
                                        {!currentTodos && <tr>
                                            <td style={{ backgroundColor: 'white' }} colSpan='6' className="text-center">TIDAK ADA DATA</td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </CardBody>
                            <CardBody>
                                <Row>
                                    <Col md="9" sm="12" xs="12">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Tampilkan</InputGroupAddon>
                                            <select
                                                name="todosPerPage"
                                                style={{ height: '38px' }}
                                                value={this.state.value}
                                                onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </select>
                                            <InputGroupAddon addonType="prepend">Baris Per-Halaman</InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col md="3" sm="12" xs="12">
                                        <Card className="mb-3s">
                                            <ButtonGroup >
                                                <Button
                                                    name="FirstButton"
                                                    value={1}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10092;&#10092;
                                       </Button>
                                                <Button
                                                    name="PrevButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, -1, this.state.maxPage)}>
                                                    &#10092;
                                       </Button>
                                                <input
                                                    type="text"
                                                    placeholder="Page"
                                                    outline='none'
                                                    value={this.state.currentPage}
                                                    onChange={(e) => this.setState({ currentPage: e.target.value })}
                                                    onKeyPress={(e) => this.enterPressedPage(e)}
                                                    style={{ height: '38px', width: '75px', textAlign: 'center' }}
                                                />
                                                <Button
                                                    name="NextButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, 1, this.state.maxPage)}>
                                                    &#10093;
                                       </Button>
                                                <Button
                                                    name="LastButton"
                                                    value={this.state.maxPage}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10093;&#10093;
                                       </Button>
                                            </ButtonGroup>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>}
                {!modal_nested_parent && !modal_nested_parent_edit &&<script>
                    {document.onkeydown = (e) => {
                        e = e || window.event;
                        if (e.ctrlKey) {
                            switch (e.key) {
                                //ctrl+s untuk modal simpan
                                case "s":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                case "S":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                //ctrl + kanan untuk last
                                case "ArrowRight":
                                    this.pagination(this.state.maxPage, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;

                                //ctrl + kiri untuk first
                                case "ArrowLeft":
                                    this.pagination(1, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;

                            }
                        }
                        switch (e.key) {
                            // enter untuk simpan
                            case "Enter":
                                if (this.state.modal_nested === true && this.state.enterButton === false) { this.insertMasterDeptShortcut(this.state.currentDepart) }
                                else if (this.state.modal_nested_edit === true && this.state.enterButton === false) {
                                    //function editMaster
                                    this.updateDept('Y', this.state.editDept, this.state.currentDepart)
                                } else if (this.state.modal_active === true && this.state.enterButton === false) {
                                    this.updateDept('Y', this.state.active_deptcode_active, this.state.currentDepart)
                                } else if (this.state.modal_deactive === true && this.state.enterButton === false) {
                                    this.updateDept('N', this.state.active_deptcode_deactive, this.state.currentDepart)
                                }
                                break;

                            // f1 untuk tambah
                            case "F1":
                                this.testFunc("nested_parent");
                                document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                            //f3 untuk search
                            case "F3":
                                document.getElementById("search").focus();
                                e.preventDefault();
                                break;

                            //kanan untuk next
                            case "ArrowRight":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, 1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;

                            //kiri untuk prev
                            case "ArrowLeft":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, -1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;

                        }
                        //menghilangkan fungsi default tombol
                        // e.preventDefault();
                    }}
                </script>}

                {modal_nested_parent &&
                    <Page
                        title="Tambah Tema"
                        className="Tambah Tema">
                            <TambahTema onClose={this.toggle('nested_parent')} 
                            />
                    </Page>}

                    {modal_nested_parent_edit &&
                    <Page
                        title="Edit Tema"
                        className="Edit Tema">
                            <EditTema onClose={this.toggle('nested_parent_edit')} 
                            />
                    </Page>}
            </Page>
        );
    }

    canBeSubmitted() {
        const { currentDepart } = this.state;
        return currentDepart.dept_name.length > 0 && currentDepart.dept_name.trim() !== "" && currentDepart.dept_name.trim().length <= 50;
    }

    handleSubmit = evt => {
        if (!this.canBeSubmitted()) {
            evt.preventDefault();
            return;
        }
    };

    updateInputValue(evt, field) {
        let currentDepart = this.state.currentDepart;
        currentDepart[field] = evt.target.value;
        this.setState({ currentDepart });

    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        });
    }
}
export default Tema;