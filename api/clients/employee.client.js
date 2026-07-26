const { EMPLOYEE_ENDPOINTS } = require('../constants/employee.constants');

class EmployeeClient {

    constructor(request, token = null) {
        this.request = request;
        this.token = token;
    }

    authHeaders() {
        return this.token
            ? { Authorization: `Bearer ${this.token}` }
            : {};
    }

    listEmployees(params = {}) {
        return this.request.get(
            EMPLOYEE_ENDPOINTS.LIST,
            {
                headers: this.authHeaders(),
                params
            }
        );
    }

    getProfileDetails(employeeId) {
        return this.request.get(
            EMPLOYEE_ENDPOINTS.PROFILE_DETAILS,
            {
                headers: this.authHeaders(),
                params: {
                    _id: employeeId
                }
            }
        );
    }

    getEmployeeNames() {
        return this.request.get(
            EMPLOYEE_ENDPOINTS.EMPLOYEE_NAMES,
            {
                headers: this.authHeaders()
            }
        );
    }

    getEmployeesForAssets() {
        return this.request.get(
            EMPLOYEE_ENDPOINTS.EMPLOYEES_FOR_ASSETS,
            {
                headers: this.authHeaders()
            }
        );
    }

    getEmployeeAssets(employeeId) {
        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.EMPLOYEE_ASSETS}/${employeeId}`,
            {
                headers: this.authHeaders()
            }
        );
    }

    getEmployeeForEdit(employeeId) {
        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.TO_EDIT}/${employeeId}`,
            {
                headers: this.authHeaders()
            }
        );
    }

    getEmployeeByEmail(emailId) {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.EMAIL_ID,
            {
                headers: this.authHeaders(),
                params: {
                    emailId
                }
            }
        );
    }

    getEmployeesByRole(params = {}) {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.BY_ROLE,
            {
                headers: this.authHeaders(),
                params
            }
        );
    }

    checkEmail(emailId) {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.CHECK_EMAIL,
            {
                headers: this.authHeaders(),
                params: {
                    emailId
                }
            }
        );
    }

    getNewJoinees() {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.GET_NEW_JOINEES,
            {
                headers: this.authHeaders()
            }
        );
    }

    getLongServiceEmployees() {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.GET_LONG_SERVICE_EMP,
            {
                headers: this.authHeaders()
            }
        );
    }

    getHierarchy(employeeId) {

        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.HIERARCHY}/${employeeId}/hierarchy`,
            {
                headers: this.authHeaders()
            }
        );
    }

    fetchFile(fileId) {

        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.FETCH_FILE}/${fileId}`,
            {
                headers: this.authHeaders()
            }
        );
    }

    createEmployee(payload) {

        return this.request.post(
            EMPLOYEE_ENDPOINTS.CREATE,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    updateEmployee(employeeId, payload) {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.UPDATE}/${employeeId}`,
            {
                headers: this.authHeaders(),
                data: payload
            }
        );
    }

    updateAssignedIds(payload) {

        return this.request.put(
            EMPLOYEE_ENDPOINTS.UPDATE_ASSIGNED_IDS,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    unassignAsset(employeeId, assignedId) {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.UNASSIGN_ASSET}/${employeeId}/unassign`,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: {
                    assignedId
                }
            }
        );
    }

    removePhoto(employeeId) {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.REMOVE_PHOTO}/${employeeId}/photo`,
            {
                headers: this.authHeaders()
            }
        );
    }

    listEmployeesWithToken(params = {}, token) {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.LIST,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params
            }
        );

    }

    getProfileDetailsWithoutId() {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.PROFILE_DETAILS,
            {
                headers: this.authHeaders()
            }
        );

    }

    getEmployeeAssetsWithoutId() {

        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.EMPLOYEE_ASSETS}/`,
            {
                headers: this.authHeaders()
            }
        );

    }

    getEmployeeForEditWithoutId() {

        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.TO_EDIT}/`,
            {
                headers: this.authHeaders()
            }
        );

    }

    getEmployeeByEmailWithParams(params = {}) {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.EMAIL_ID,
            {
                headers: this.authHeaders(),
                params
            }
        );

    }

    checkEmailWithParams(params = {}) {

        return this.request.get(
            EMPLOYEE_ENDPOINTS.CHECK_EMAIL,
            {
                headers: this.authHeaders(),
                params
            }
        );

    }

    fetchFileWithoutId() {

        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.FETCH_FILE}/`,
            {
                headers: this.authHeaders()
            }
        );

    }

    getHierarchyWithoutId() {

        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.HIERARCHY}//hierarchy`,
            {
                headers: this.authHeaders()
            }
        );

    }

    createEmployeeWithoutAuth(payload) {

        return this.request.post(
            EMPLOYEE_ENDPOINTS.CREATE,
            {
                data: payload
            }
        );

    }

    createEmployeeWithToken(payload, token) {

        return this.request.post(
            EMPLOYEE_ENDPOINTS.CREATE,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );

    }

    createEmployeeWithBody(body = {}) {

        return this.request.post(
            EMPLOYEE_ENDPOINTS.CREATE,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: body
            }
        );

    }

    updateAssignedIdsWithoutAuth(payload) {

        return this.request.put(
            EMPLOYEE_ENDPOINTS.UPDATE_ASSIGNED_IDS,
            {
                data: payload
            }
        );

    }

    updateAssignedIdsWithToken(payload, token) {

        return this.request.put(
            EMPLOYEE_ENDPOINTS.UPDATE_ASSIGNED_IDS,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );

    }

    updateAssignedIdsWithBody(body = {}) {

        return this.request.put(
            EMPLOYEE_ENDPOINTS.UPDATE_ASSIGNED_IDS,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: body
            }
        );

    }

    updateEmployeeWithoutId(payload) {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.UPDATE}/`,
            {
                headers: this.authHeaders(),
                data: payload
            }
        );

    }

    updateEmployeeWithBody(body = {}) {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.UPDATE}/${process.env.TEST_EMPLOYEE_ID}`,
            {
                headers: this.authHeaders(),
                data: body
            }
        );

    }

    unassignAssetWithoutId(assignedId) {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.UNASSIGN_ASSET}//unassign`,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: {
                    assignedId
                }
            }
        );

    }

    unassignAssetWithBody(employeeId, body = {}) {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.UNASSIGN_ASSET}/${employeeId}/unassign`,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: body
            }
        );

    }

    removePhotoWithoutId() {

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.REMOVE_PHOTO}//photo`,
            {
                headers: this.authHeaders()
            }
        );

    }

    async updateEmployeeWithFiles(employeeId, fields = {}, files = {}) {

        const multipart = {};
        const fs = require('fs');
        const path = require('path');

        Object.entries(fields).forEach(([key, value]) => {
            multipart[key] = value;
        });

        Object.entries(files).forEach(([key, filePath]) => {
            const resolvedPath = path.isAbsolute(filePath)
                ? filePath
                : path.resolve(process.cwd(), filePath);

            const fileBuffer = fs.readFileSync(resolvedPath);

            multipart[key] = {
                name: path.basename(resolvedPath),
                mimeType: 'application/octet-stream',
                buffer: fileBuffer
            };
        });

        return this.request.put(
            `${EMPLOYEE_ENDPOINTS.UPDATE}/${employeeId}`,
            {
                headers: this.authHeaders(),
                multipart
            }
        );

    }

    getEmployeeDetails(employeeId) {

        return this.request.get(
            `${EMPLOYEE_ENDPOINTS.LIST}/${employeeId}`,
            {
                headers: this.authHeaders()
            }
        );
    }
}

module.exports = EmployeeClient;