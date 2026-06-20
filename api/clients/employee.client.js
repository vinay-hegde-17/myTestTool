const { EMPLOYEE_ENDPOINTS } =
    require('../constants/employee.constants');

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

    getEmployeesByRole() {
        return this.request.get(
            EMPLOYEE_ENDPOINTS.BY_ROLE,
            {
                headers: this.authHeaders()
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
}

module.exports = EmployeeClient;