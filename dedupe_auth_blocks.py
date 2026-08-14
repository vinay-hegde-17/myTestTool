import re
from pathlib import Path

files = [
    Path('tests/api/employee.api.spec.js'),
    Path('tests/api/itDeclaration.api.spec.js'),
    Path('tests/api/leave.api.spec.js'),
    Path('tests/api/raisedQueries.api.spec.js'),
    Path('tests/api/weeklyReport.api.spec.js'),
]

titles = {
    'tests/api/employee.api.spec.js': [
        "TC02 Get Employee List Without Token",
        "TC14 Get Profile Details Without Authorization",
        "TC17 Get Employee Names Without Authorization",
        "TC21 Get Employees For Assets Without Authorization",
        "TC27 Get Employee Assets Without Authorization",
        "TC31 Get New Joinees Without Authorization",
        "TC35 Get Long Service Employees Without Authorization",
        "TC40 Get Employee By Email Without Authorization",
        "TC46 Get Employees By Role Without Authorization",
        "TC51 Get Employee For Edit Without Authorization",
        "TC52 Get Employee For Edit Invalid Token",
        "TC60 Create Employee Without Authorization",
        "TC67 Assign Asset Without Authorization",
        "TC78 Update Employee Without Authorization",
        "TC79 Update Employee Invalid Token",
        "TC87 Unassign Without Authorization",
        "TC97 Fetch File Without Authorization",
        "TC103 Check Email Without Authorization",
        "TC111 Remove Photo Without Authorization",
        "TC119 Get Hierarchy Without Authorization",
        "TC130 Get Employee Details Without Authorization",
        "TC131 Get Employee Details Invalid Token",
    ],
    'tests/api/itDeclaration.api.spec.js': [
        "TC05 Get proof file without Authorization",
        "TC10 Get IT declaration without Authorization",
        "TC15 Get proofs without Authorization",
        "TC19 Get zip proofs without Authorization",
        "TC24 Get employees without Authorization",
        "TC27 Get ITD configuration without Authorization",
        "TC32 Create IT declaration without Authorization",
        "TC37 Update IT declaration without Authorization",
        "TC43 Upload proofs without Authorization",
        "TC49 Update ITD configuration without Authorization",
        "TC53 Delete proof without Authorization",
    ],
    'tests/api/leave.api.spec.js': [
        "TC06 Get all leave records without Authorization",
        "TC10 Get leave threshold without Authorization",
        "TC15 Get employee leave history without Authorization",
        "TC21 Get approver leave requests without Authorization",
        "TC24 Get financial year leave history without Authorization",
        "TC35 Apply leave without Authorization",
        "TC41 Update leave without Authorization",
        "TC44 Submit reject request without Authorization",
        "TC47 Delete leave without Authorization",
        "TC52 Get overall leave summary without Authorization",
    ],
    'tests/api/raisedQueries.api.spec.js': [
        "TC07 Get raised queries without Authorization",
        "TC11 Get query types without Authorization",
        "TC17 Get employee queries without Authorization",
        "TC22 Raise query without Authorization",
        "TC31 Update query without Authorization",
        "TC38 Update raised query without Authorization",
        "TC44 Get FAQ without Authorization",
    ],
    'tests/api/weeklyReport.api.spec.js': [
        "TC12 Get weekly reports without Authorization",
        "TC21 Create weekly reports without Authorization",
    ],
}

for file_path in files:
    path = str(file_path)
    text = file_path.read_text(encoding='utf-8')
    for title in titles.get(path, []):
        pattern = re.compile(rf"(?ms)^\s*test\(\s*['\"]{re.escape(title)}['\"][^)]*?\)\s*=>\s*\{{.*?^\s*\}}\);\s*")
        text, count = pattern.subn('', text)
        if count:
            print(f'{path}: removed {count} block(s) for {title}')
    file_path.write_text(text, encoding='utf-8')

print('AUTH_DUPLICATE_DEDUPE_DONE')
