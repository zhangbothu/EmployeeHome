<template>
	<view class="u-wrap">

		<view class="u-menu-wrap" style="margin-bottom: 50px;">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop"
				:enable='enable'>
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item"
					:class="[current==index ? 'u-tab-item-active' : '']" :data-current="index"
					@tap.stop="swichMenu(index)">
					<text class="u-line-1">{{ userType==1 ? item.admin_name  : item.username}}</text>
				</view>
			</scroll-view>
			<scroll-view scroll-y class="right-box" lower-threshold="50" @scrolltolower="scrolltolower">
				<view class="page-view">
					<view class="class-item">
						<view class="u-search-box">
							<u-search v-if="current == 0" placeholder="请输入员工名称或工号" :show-action='false'
								v-model="searchData.staff" @change="searchChange"></u-search>
							<u-search v-if="current == 1" placeholder="请输入部门名称" :show-action='false'
								v-model="searchData.department" @change="searchChange"></u-search>
							<u-search v-if="current == 2" placeholder="请输入职位名称" :show-action='false'
								v-model="searchData.job" @change="searchChange"></u-search>
							<u-search v-if="current == 3" placeholder="请输入公告名" :show-action='false'
								v-model="searchData.messga" @change="searchChange"></u-search>
							<view class="Selector" v-if="current == 0">
								<view class="Selector1" v-if="current == 0">
									<view class="Selector2" v-if="current == 0">
										<picker @change="departmentPickerChange" :value="staffSearchForm.department"
											:range="departmentSelector">
											<view class="uni-input">部门: {{staffSearchForm.department}}</view>
										</picker>
									</view>
									<view class="Selector2" v-if="current == 0">
										<picker @change="jobPickerChange" :value="staffSearchForm.job"
											:range="jobSelector">
											<view class="uni-input">职位: {{staffSearchForm.job}}</view>
										</picker>
									</view>
								</view>
								<view class="Selector1" v-if="current == 0">
									<view class="Selector3" v-if="current == 0">
										<picker @change="sexPickerChange" :value="staffSearchForm.sex"
											:range="sexSelector">
											<view class="uni-input">性别: {{staffSearchForm.sex}}</view>
										</picker>
									</view>
									<view class="Selector3" v-if="current == 0">
										<picker @change="statusPickerChange" :value="staffSearchForm.status"
											:range="statusSelector">
											<view class="uni-input">权限: {{staffSearchForm.status}}</view>
										</picker>
									</view>
								</view>
							</view>
						</view>
						<!-- 员工管理 -->
						<view class="item-container" v-if="current == 0">
							<view class="list-box" v-for="(item ,index) in staffData" :key="index">
								<view class="item-content">
									<view @click="onLook(index)">
										<view>用户名称：{{item.name}}</view>
										<view>工号：{{item.username}}</view>
										<view>性别：{{item.sex==1?'男':'女'}}</view>
									</view>
									<view class="btn-box" v-if="userType == 1 ">
										<button size="mini" @click="onEdit(index)">修改</button>
										<button v-if="item.name != userInfo.username " size="mini" type="warn"
											@click="onDelete(item.username)">删除</button>
									</view>
								</view>

							</view>
						</view>

						<!-- 部门管理 -->
						<view class="item-container" v-if="current == 1">
							<view class="list-box" v-for="(item ,index) in departmentData" :key="index">
								<view class="item-content">
									<view @click="onLook(index)">
										<view>部门名称：{{item.name}}</view>
										<!-- <view>部门介绍：{{item.intro}}</view> -->
									</view>
									<view class="btn-box" v-if="userType == 1 ">
										<button size="mini" @click="onEdit(index)">修改</button>
										<button size="mini" type="warn" @click="onDelete(item.name)">删除</button>
									</view>
								</view>

							</view>
						</view>

						<!-- 职位管理 -->
						<view class="item-container" v-if="current == 2">
							<view class="list-box" v-for="(item ,index) in jobData" :key="index">
								<view class="item-content">
									<view @click="onLook(index)">
										<view>职位名称：{{item.name}}</view>
									</view>
									<view class="btn-box" v-if="userType == 1 ">
										<button size="mini" @click="onEdit(index)">修改</button>
										<button size="mini" type="warn" @click="onDelete(item.name)">删除</button>
									</view>

								</view>

							</view>
						</view>

						<!-- 公告管理 -->
						<view class="item-container" v-if="current == 3">
							<view class="list-box" v-for="(item ,index) in messgaData" :key="index">
								<view class="item-content">
									<view @click="onLook(index)">
										<view>公告名称：{{item.title}}</view>
										<view>创建人：{{item.username}}</view>
										<view>创建时间：{{item.create_time}}</view>
									</view>
									<view class="btn-box" v-if="userType == 1 ">
										<button size="mini" @click="onEdit(index)">修改</button>
										<button size="mini" type="warn" @click="onDelete(item.title)">删除</button>
									</view>
								</view>

							</view>
						</view>
						<view class="add-btn" v-if="userType==1" @click="onAdd">添加</view>
					</view>
				</view>

			</scroll-view>
		</view>


		<u-popup v-model="showLook" mode="center" width="80%" :closeable="true">
			<view class="popup-content" v-if="current==0 && staffData[lookId]">
				<view class="content-box">
					<u-form :model="form" ref="uForm" style="width: 100%;" label-width="100"
						v-if="current==0 && staffData[lookId]">
						<view>姓名：{{staffData[lookId].name}}</view>
						<view>工号：{{staffData[lookId].username}}</view>
						<view v-if="userType == 1">身份证号：{{staffData[lookId].card_id}}</view>
						<view v-if="userType == 1">手机：{{staffData[lookId].phone}}</view>
						<view>权限：{{staffData[lookId].status==1?"管理员":"普通用户"}}</view>
						<view>性别：{{staffData[lookId].sex==1?"男":"女"}}</view>
						<view>职位：{{staffData[lookId].job}}</view>
						<view>部门：{{staffData[lookId].department}}</view>
						<view v-if="userType == 1">住址：{{staffData[lookId].address}}</view>
						<view v-if="userType == 1">出生日期：{{staffData[lookId].birthday}}</view>
						<view v-if="userType == 1">学历：{{staffData[lookId].education}}</view>
						<view>国籍：{{staffData[lookId].nation}}</view>
						<view>政治面貌：{{staffData[lookId].party}}</view>
						<view>专长：{{staffData[lookId].speciality}}</view>
						<view>QQ号：{{staffData[lookId].qq_num}}</view>
						<view>邮编：{{staffData[lookId].post_code}}</view>
						<view>爱好：{{staffData[lookId].hobby}}</view>
						<view>其他：{{staffData[lookId].remark}}</view>
					</u-form>
				</view>
				<view class="btn2-box" v-if="userType == 1 &&current==0">
					<button class="look-btn" @click="onEdit(lookId)">修改</button>
					<button class="look-btn" type="warn" @click="onDelete(staffData[lookId].username)">删除</button>
				</view>
			</view>

			<view class="popup-content2">
				<view class="content-box1" v-if="current==1 && departmentData[lookId]">
					<u-form :model="form" ref="uForm" style="width: 100%;" label-width="100">
						<view>部门名称:{{departmentData[lookId].name}}</view>
						<view>部门介绍:{{departmentData[lookId].remark}}</view>
					</u-form>
				</view>
				<view class="btn2-box" v-if="userType == 1&&current==1 ">
					<button class="look-btn" @click="onEdit(lookId)">修改</button>
					<button class="look-btn" type="warn" @click="onDelete(departmentData[lookId].name)">删除</button>
				</view>
				<view class="content-box1" v-if="current==2 && jobData[lookId]">
					<u-form :model="form" ref="uForm" style="width: 100%;" label-width="100">
						<view>职位名称:{{jobData[lookId].name}}</view>
						<view>职位介绍:{{jobData[lookId].remark}}</view>
					</u-form>
				</view>
				<view class="btn2-box" v-if="userType == 1&&current==2 ">
					<button class="look-btn" @click="onEdit(lookId)">修改</button>
					<button class="look-btn" type="warn" @click="onDelete(jobData[lookId].name)">删除</button>
				</view>
				<view class="content-box1" v-if="current==3 && messgaData[lookId]">
					<u-form :model="form" ref="uForm" style="width: 100%;" label-width="100">
						<view>公告:{{messgaData[lookId].title}}</view>
						<view>创建时间:{{messgaData[lookId].create_time}}</view>
						<view>创建人:{{messgaData[lookId].username}}</view>
						<view>内容:{{messgaData[lookId].content}}</view>
					</u-form>
				</view>
				<view class="btn2-box" v-if="userType == 1&&current==3 ">
					<button class="look-btn" @click="onEdit(lookId)">修改</button>
					<button class="look-btn" type="warn" @click="onDelete(messgaData[lookId].title)">删除</button>
				</view>
			</view>


		</u-popup>
		<u-popup v-model="showEdit" mode="center" width="80%" height="400px" :closeable="true">
			<view class="popup-content">
				<u-form :model="form" ref="uForm" style="width: 100%;" label-width="100" v-if="current==0">
					<u-form-item>
						<label><span style="color:red;">* </span>用户名 : </label>
						<u-input v-model="lookStaffForm.name" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>工号 : </label>
						<u-input disabled v-model="lookStaffForm.username" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>身份证号: </label>
						<u-input v-model="lookStaffForm.card_id" />
					</u-form-item>
					<u-form-item label="密码">
						<u-input v-model="lookStaffForm.pwd" :type="type" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>性别: </label>
						<picker @change="sexPickerChange2" :value="lookStaffForm.sex" :range="sexSelector2">
							<view class="uni-input">{{lookStaffForm.sex}}</view>
						</picker>
					</u-form-item>

					<u-form-item>
						<label><span style="color:red;">* </span>部门 : </label>
						<picker @change="departmentPickerChange2" :value="lookStaffForm.department"
							:range="departmentSelector2">
							<view class="uni-input">{{lookStaffForm.department}}</view>
						</picker>
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>职位 : </label>
						<picker @change="jobPickerChange2" :value="lookStaffForm.job" :range="jobSelector2">
							<view class="uni-input">{{lookStaffForm.job}}</view>
						</picker>
					</u-form-item>

					<u-form-item>
						<label><span style="color:red;">* </span>权限 : </label>
						<picker @change="statusPickerChange2" :value="lookStaffForm.status" :range="statusSelector2">
							<view class="uni-input">{{lookStaffForm.status}}</view>
						</picker>
					</u-form-item>
					<u-form-item label="手机">
						<u-input v-model="lookStaffForm.phone" />
					</u-form-item>

					<u-form-item label="住址">
						<u-input v-model="lookStaffForm.address" />
					</u-form-item>
					<u-form-item label="出生日期">
						<picker mode="date" :value="lookStaffForm.birthday" :start="startDate" :end="endDate"
							@change="bindDateChange">
							<view class="uni-input">{{lookStaffForm.birthday||'请选择生日'}}</view>
						</picker>
					</u-form-item>
					<u-form-item label="学历">
						<picker @change="educationPickerChange2" :value="lookStaffForm.education"
							:range="educationSelector2">
							<view class="uni-input">{{lookStaffForm.education||'未选择'}}</view>
						</picker>
					</u-form-item>
					<u-form-item label="国籍">
						<u-input v-model="lookStaffForm.nation" />
					</u-form-item>
					<u-form-item label="政治面貌">
						<u-input v-model="lookStaffForm.party" />
					</u-form-item>
					<u-form-item label="QQ号">
						<u-input v-model="lookStaffForm.qq_num" />
					</u-form-item>
					<u-form-item label="邮箱">
						<u-input v-model="lookStaffForm.email" />
					</u-form-item>
					<u-form-item label="邮编">
						<u-input v-model="lookStaffForm.post_code" />
					</u-form-item>
					<u-form-item label="专长">
						<u-input v-model="lookStaffForm.speciality" />
					</u-form-item>
					<u-form-item label="爱好">
						<u-input v-model="lookStaffForm.hobby" />
					</u-form-item>
					<u-form-item label="其他">
						<u-input v-model="lookStaffForm.remark" />
					</u-form-item>
				</u-form>
				<u-form :model="form" ref="uForm1" style="width: 100%;" label-width="100" v-if="current==1">
					<u-form-item>
						<label><span style="color:red;">* </span>部门: </label>
						<u-input v-model="lookDepartmentForm.name" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:transparent;">.. </span>简介: </label>
						<u-input v-model="lookDepartmentForm.intro" />
					</u-form-item>
				</u-form>
				<u-form :model="form" ref="uForm2" style="width: 100%;" label-width="100" v-if="current==2">
					<u-form-item>
						<label><span style="color:red;">* </span>职位 : </label>
						<u-input v-model="lookJobForm.name" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:transparent;">.. </span>简介 : </label>
						<u-input v-model="lookJobForm.intro" />
					</u-form-item>
				</u-form>

				<u-form :model="form" ref="uForm4" style="width: 100%;" label-width="150" v-if="current==3">
					<u-form-item>
						<label><span style="color:red;">* </span>公告名称 : </label>
						<u-input v-model="lookMessgaForm.title" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>公告内容 : </label>
						<u-input v-model="lookMessgaForm.content" />
					</u-form-item>
				</u-form>
				<view class="uni-form-item uni-column" v-if="current==0">
									<checkbox-group name="ai" @change="chk">	
										<label >
											<checkbox style="zoom:65%;" value="true"  /><text style="font-size:28upx">发送邮件通知</text>		
									</label>
				</checkbox-group>	
				</view>
				<button @click="submit('edit')" type="primary" size="mini">提交</button>
			</view>
		</u-popup>

		<u-popup v-model="showAdd" mode="center" width="80%" height="400px" :closeable="true">
			<view class="popup-content">
				<u-form :model="form" ref="uForm" style="width: 100%;" label-width="100" v-if="current==0">
					<u-form-item>
						<label><span style="color:red;">* </span>用户名 : </label>
						<u-input v-model="lookStaffForm.name" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>工号 : </label>
						<u-input v-model="lookStaffForm.username" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>身份证号: </label>
						<u-input v-model="lookStaffForm.card_id" />
					</u-form-item>
					<u-form-item label="密码">
						<u-input v-model="lookStaffForm.pwd" :type="type" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>性别: </label>
						<picker @change="sexPickerChange2" :value="lookStaffForm.sex" :range="sexSelector2">
							<view class="uni-input">{{lookStaffForm.sex||'请选择性别'}}</view>
						</picker>
					</u-form-item>

					<u-form-item>
						<label><span style="color:red;">* </span>部门 : </label>
						<picker @change="departmentPickerChange2" :value="lookStaffForm.department"
							:range="departmentSelector2">
							<view class="uni-input">{{lookStaffForm.department||'请选择部门'}}</view>
						</picker>
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>职位 : </label>
						<picker @change="jobPickerChange2" :value="lookStaffForm.job" :range="jobSelector2">
							<view class="uni-input">{{lookStaffForm.job||'请选择职位'}}</view>
						</picker>
					</u-form-item>

					<u-form-item>
						<label><span style="color:red;">* </span>权限 : </label>
						<picker @change="statusPickerChange2" :value="lookStaffForm.status" :range="statusSelector2">
							<view class="uni-input">{{lookStaffForm.status||'请选择权限'}}</view>
						</picker>
					</u-form-item>
					<u-form-item label="手机">
						<u-input v-model="lookStaffForm.phone" />
					</u-form-item>


					<u-form-item label="住址">
						<u-input v-model="lookStaffForm.address" />
					</u-form-item>
					<u-form-item label="生日">
						<picker mode="date" :value="lookStaffForm.birthday" :start="startDate" :end="endDate"
							@change="bindDateChange">
							<view class="uni-input">{{lookStaffForm.birthday||'请选择生日'}}</view>
						</picker>
						<!-- <u-input v-model="lookStaffForm.birthday" /> -->
					</u-form-item>
					<u-form-item label="学历">
						<picker @change="educationPickerChange2" :value="lookStaffForm.education"
							:range="educationSelector2">
							<view class="uni-input">{{lookStaffForm.education||'请选择学历'}}</view>
						</picker>
					</u-form-item>
					<u-form-item label="国籍">
						<u-input v-model="lookStaffForm.nation" />
					</u-form-item>
					<u-form-item label="政治面貌">
						<u-input v-model="lookStaffForm.party" />
					</u-form-item>
					<u-form-item label="QQ号">
						<u-input v-model="lookStaffForm.qq_num" />
					</u-form-item>
					<u-form-item label="邮箱">
						<u-input v-model="lookStaffForm.email" />
					</u-form-item>
					<u-form-item label="邮编">
						<u-input v-model="lookStaffForm.post_code" />
					</u-form-item>

					<u-form-item label="专长">
						<u-input v-model="lookStaffForm.speciality" />
					</u-form-item>
					<u-form-item label="爱好">
						<u-input v-model="lookStaffForm.hobby" />
					</u-form-item>
					<u-form-item label="其他">
						<u-input v-model="lookStaffForm.remark" />
					</u-form-item>

				</u-form>
				<u-form :model="form" ref="uForm1" style="width: 100%;" label-width="100" v-if="current==1">
					<u-form-item>
						<label><span style="color:red;">* </span>部门: </label>
						<u-input v-model="lookDepartmentForm.name" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:transparent;">.. </span>简介: </label>
						<u-input v-model="lookDepartmentForm.intro" />
					</u-form-item>
				</u-form>
				<u-form :model="form" ref="uForm2" style="width: 100%;" label-width="100" v-if="current==2">
					<u-form-item>
						<label><span style="color:red;">* </span>职位 : </label>
						<u-input v-model="lookJobForm.name" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:transparent;">.. </span>简介: </label>
						<u-input v-model="lookJobForm.intro" />
					</u-form-item>
				</u-form>

				<u-form :model="form" ref="uForm4" style="width: 100%;" label-width="150" v-if="current==3">
					<u-form-item>
						<label><span style="color:red;">* </span>公告名称 : </label>
						<u-input v-model="lookMessgaForm.title" />
					</u-form-item>
					<u-form-item>
						<label><span style="color:red;">* </span>公告内容 : </label>
						<u-input v-model="lookMessgaForm.content" />
					</u-form-item>
				</u-form>
					<view class="uni-form-item uni-column" v-if="current==3">
										<checkbox-group name="ai" @change="chk">	
											<label >
												<checkbox style="zoom:65%;" value="true" /><text style="font-size:28upx">发送邮件通知</text>		
										</label>
					</checkbox-group>	
					</view>
				<button @click="submit('add')" type="primary" size="mini">提交</button>
			</view>
		</u-popup>
		<u-popup v-model="ensureDelete" mode="center" width="80%" height="200px" :closeable="false">
			<view class="popup-content1">
				<view>是否确认删除？删除后将无法恢复。</view>
				<view class='btn3-box'>
					<button class="look-btn" @click="ensureDeleteItem()" type="warn">确认</button>
					<button class="look-btn" @click="cancelItem">取消</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import md5 from "../../common/md5.js";
	export default {
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()

			for (let i = 2020; i <= date.getFullYear(); i++) {
				years.push(i)
			}

			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			return {
				token:'',
				userInfo: {},
				type: 'password',
				baseurl: 'http://1.14.94.7/api',
				limit: 8,
				skip: 0,
				staffSearchForm: {
					department: '全选',
					job: '全选',
					sex: '全选',
					status: '全选'
				},
				lookStaffForm: {
					username: '',
					name: '',
					phone: '',
					sex: '',
					pwd: '',
					department: '',
					job: '',
					status: '',
					post_code: '',
					qq_num: '',
					email: '',
					party: '',
					education: '',
					remark: '',
					card_id: '',
					address: '',
					birthday: '',
					nation: '',
					speciality: '',
					hobby: ''
				},
				lookJobForm: {
					name: '',
					intro: ''
				},
				lookDepartmentForm: {
					name: '',
					intro: ''
				},
				lookMessgaForm: {
					title: '',
					content: '',
					time: '',
					people: ''
				},
				searchData: {
					staff: '',
					department: '',
					job: '',
					messga: ''
				},


				department_index: 0,
				sex_index: 0,
				status_index: 0,
				job_index: 0,
				sex_index2: 0,
				department_index2: 0,
				formname: '',

				userType: 1, //1是管理 0用户
				tabbar: [{
						admin_name: '员工管理',
						username: '员工查找'
					},
					{
						admin_name: '部门管理',
						username: '部门查找'
					},
					{
						admin_name: '职位管理',
						username: '职位查找'
					},

					{
						admin_name: '公告管理',
						username: '公告查找'
					}
				],
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度



				jobSelector: ['全选'], //搜索关键字
				jobSelector2: [], //搜索关键字
				sexSelector: ['全选', '男', '女'],
				sexSelector2: ['男', '女'],
				departmentSelector: ['全选'],
				departmentSelector2: [],
				statusSelector: ['全选', '管理员', '普通用户'],
				statusSelector2: ['管理员', '普通用户'],
				educationSelector2: ["初中学历", "高中学历", "本科学历", "硕士", "博士"],
				showEdit: false, //弹窗展示
				showLook: false,
				showAdd: false,
				ensureDelete: false,
				sendMessaga:false,
				lookId: 0,
				funcData: [],
				form: {
					name: '',
					pwd: '',
					content: '',
					department: '', //职位
					sex: '' //性别
				},

				departmentData: [], //部门数据
				jobData: [], //职位数据
				staffData: [],


				staffData2: [{
					// 	username: '20183349',
					// 	name: '张三',
					// 	phone: '123456',
					// 	sex: '男',
					// 	pwd: 'jashfkjasdhfkj',
					// 	department: '技术部',
					// 	job: '员工',
					// 	status: '管理员'
				}, ], //员工数据
				messgaData: [
					// 	{
					// 	title: '参会公告',
					// 	content: '公告内容'
					// }, {
					// 	title: '参会公告',
					// 	content: '公告内容公告内容公告内容'
					// }, 
				],
				actionType: 0 // 0添加 1编辑
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onShow() {
			this.enable = true
		},
		onHide() {
			this.enable = false
		},
		onLoad() {
			this.token = uni.getStorageSync('token')
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url:'../login/login'
				})
			} else {
				this.userInfo = uni.getStorageSync('userInfo')
				if (this.userInfo.status == 1) {
					this.userType = 1
				} else {
					this.userType = 0
				}
			}
			this.getUserList(true);
			this.getJobList(true);
			this.getDeptList(true);

		},
		methods: {
			scrolltolower() {

				// console.log("触底")

				switch (this.current) {
					case 0:
						this.getUserList(true)
						break;
					case 1:
						this.getDeptList()
						break;

					case 2:
						this.getJobList()
						break;
					case 3:
						this.getNoticeList()
						break;
				}
			},
			chk:function(e){
				// console.log(e.detail.value[0])
				if(e.detail.value[0]=="true")
							{this.sendMessaga=true}

						},
			searchChange(e) {
				// console.log("-------");
				// console.log(e);


				// console.log(this.searchData);
				clearTimeout(this.ttt)

				this.ttt = setTimeout(() => {

					this.skip = 0;
					switch (this.current) {
						case 0:
							// console.log("-------");
							// console.log(this.staffSearchForm);
							this.staffSearchForm = {
								department: "全选",
								sex: "全选",
								job: "全选",
								status: "全选",
							}
							if (e) {
								this.staffData = []
								this.skip = 0
								this.getUserList()
							} else {
								this.getUserList(true)
							}
							break;
						case 1:
							this.departmentData = []
							this.getDeptList()
							break;

						case 2:
							this.jobData = []
							this.getJobList()
							break;
						case 3:
							this.messgaData = []
							this.getNoticeList()
							break;
					}

				}, 1500)

			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},

			bindDateChange: function(e) {
				if (e.target.value != null) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.lookStaffForm.birthday = e.target.value
				}
			},
			departmentPickerChange(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.staffSearchForm.department = this.departmentSelector[e.target.value]
					// console.log("-------");
					// console.log(this.staffSearchForm);
					this.skip = 0
					this.limit = 8
					this.searchData.staff = '';
					this.staffData = []

					let {
						department,
						sex,
						job,
						status
					} = this.staffSearchForm;
					if (department == '全选' && sex == '全选' && job == '全选' && status == '全选') {
						this.getUserList(true)
					} else {
						this.getUserList()
					}
				}
			},
			jobPickerChange(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.staffSearchForm.job = this.jobSelector[e.target.value]
					this.skip = 0
					this.limit = 8
					this.staffData = []
					this.searchData.staff = '';
					let {
						department,
						sex,
						job,
						status
					} = this.staffSearchForm;
					if (department == '全选' && sex == '全选' && job == '全选' && status == '全选') {
						this.getUserList(true)
					} else {
						this.getUserList()
					}
				}
			},
			sexPickerChange(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.staffSearchForm.sex = this.sexSelector[e.target.value]
					this.skip = 0
					this.limit = 8
					this.staffData = []
					this.searchData.staff = '';
					let {
						department,
						sex,
						job,
						status
					} = this.staffSearchForm;
					if (department == '全选' && sex == '全选' && job == '全选' && status == '全选') {
						this.getUserList(true)
					} else {
						this.getUserList()
					}
				}
			},
			statusPickerChange(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.staffSearchForm.status = this.statusSelector[e.target.value]
					// if (this.staffSearchForm.status == '全选') return
					this.skip = 0
					this.limit = 8
					this.staffData = []
					this.searchData.staff = '';
					let {
						department,
						sex,
						job,
						status
					} = this.staffSearchForm;
					if (department == '全选' && sex == '全选' && job == '全选' && status == '全选') {
						this.getUserList(true)
					} else {
						this.getUserList()
					}
				}
			},
			sexPickerChange2(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.lookStaffForm.sex = this.sexSelector2[e.target.value]

				}
			},
			jobPickerChange2(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.lookStaffForm.job = this.jobSelector2[e.target.value]

				}
			},
			departmentPickerChange2(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.lookStaffForm.department = this.departmentSelector2[e.target.value]

				}
			},
			statusPickerChange2(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.lookStaffForm.status = this.statusSelector2[e.target.value]

				}
			},
			educationPickerChange2(e) {
				if (e.target.value >= 0) {
					// console.log('picker发送选择改变，携带值为', e.target.value)
					this.lookStaffForm.education = this.educationSelector2[e.target.value]

				}
			},
			//获取数据
			async getUserList(init) {
				let data = {
					limit: this.limit,
					skip: this.skip,
				}
				// console.log("------------data-------")
				// console.log(data)
				let url = '';
				let method = 'GET'
				if (init) {
					// console.log("---all----");
					url = 'user/get-all';
				} else {
					if (this.searchData.staff) {
						url = 'user/search/' + this.searchData.staff

					} else {
						method = 'POST';
						url = 'user/get'
						if (this.staffSearchForm.department == '全选') {

						} else {
							data.department = this.staffSearchForm.department;
						}

						if (this.staffSearchForm.sex == '全选') {

						} else if (this.staffSearchForm.sex == '男') {
							data.sex = 1
						} else {
							data.sex = 2
						}

						if (this.staffSearchForm.job == '全选') {

						} else {
							data.job = this.staffSearchForm.job;
						}

						if (this.staffSearchForm.status == '全选') {
							// data.status = 2
						} else if (this.staffSearchForm.status == '管理员') {
							data.status = 1
						} else {
							data.status = 2
						}
					}
				};


				let res = await this.$myRequest({
					url,
					method,
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					data,
				});
				
				// let this.res=[],
				// uni.request({
				// 	//获取每一页的数据然后做拼接
				// 	url,
				// 	method,
				// 	headers:{
				// 		"Authorization":"Bearer "+this.token,  
				// 	},
				// 	data
				// });
				
				if (res && res.length > 0) {
					// console.log(res);

					res.forEach(item => {
						if (item.job == null)
							item.job = '未定'
						if (item.department == null)
							item.department = '未定'
						this.staffData.push(item)
					})
					this.skip = (this.skip + 9);
					this.limit = (this.limit + 9);
				} else {
					if (this.searchData.staff) {
						this.staffData = []
					}
					uni.showToast({
						title: res.detail || '没有数据了',
						icon: 'none'
					})
				}

			},

			onAdd() {
				this.sendMessaga=false
				this.reNew()
				this.showAdd = true
				this.actionType = 0
			},
			reNew() {
				this.lookStaffForm.username = ''
				this.lookStaffForm.name = ''
				this.lookStaffForm.phone = ''
				this.lookStaffForm.sex = ''
				this.lookStaffForm.pwd = ''
				this.lookStaffForm.department = ''
				this.lookStaffForm.job = ''
				this.lookStaffForm.status = ''
				this.lookStaffForm.education = ''
				this.lookStaffForm.email = ''
				this.lookStaffForm.party = ''
				this.lookStaffForm.post_code = ''
				this.lookStaffForm.qq_num = ''
				this.lookStaffForm.remark = ''
				this.lookStaffForm.card_id = ''
				this.lookStaffForm.address = ''
				this.lookStaffForm.birthday = ''
				this.lookStaffForm.nation = ''
				this.lookStaffForm.speciality = ''
				this.lookStaffForm.hobby = ''
				this.lookJobForm.name = ''
				this.lookJobForm.intro = ''
				this.lookDepartmentForm.name = ''
				this.lookDepartmentForm.intro = ''
				this.lookMessgaForm.title = ''
				this.lookMessgaForm.content = ''
			},
			onEdit(id) {
				this.sendMessaga=false
				this.lookId = id
				this.showEdit = true
				this.actionType = 1

				if (this.current == 0) {
					// console.log("-------");
					// console.log(this.staffData);

					this.lookStaffForm.username = this.staffData[id].username
					this.lookStaffForm.name = this.staffData[id].name
					this.lookStaffForm.phone = this.staffData[id].phone
					this.lookStaffForm.pwd = ""
					this.lookStaffForm.department = this.staffData[id].department
					this.lookStaffForm.job = this.staffData[id].job
					this.lookStaffForm.education = this.staffData[id].education
					this.lookStaffForm.email = this.staffData[id].email
					this.lookStaffForm.party = this.staffData[id].party
					this.lookStaffForm.post_code = this.staffData[id].post_code
					this.lookStaffForm.qq_num = this.staffData[id].qq_num
					this.lookStaffForm.remark = this.staffData[id].remark
					this.lookStaffForm.card_id = this.staffData[id].card_id
					this.lookStaffForm.address = this.staffData[id].address
					this.lookStaffForm.birthday = this.staffData[id].birthday
					this.lookStaffForm.nation = this.staffData[id].nation
					this.lookStaffForm.speciality = this.staffData[id].speciality
					this.lookStaffForm.hobby = this.staffData[id].hobby

					switch (this.staffData[id].sex) {
						case 1:
							this.lookStaffForm.sex = '男';
							break;
						case 2:
							this.lookStaffForm.sex = '女';
							break
						default:
							this.lookStaffForm.sex = '全部';
					}

					switch (this.staffData[id].status) {
						case 1:
							this.lookStaffForm.status = '管理员'
							break;
						case 2:
							this.lookStaffForm.status = '普通用户'
							break;
						default:
							this.lookStaffForm.status = '全部'
					}

				} else if (this.current == 1) {
					// console.log("-------");
					// console.log(this.lookDepartmentForm);
					this.lookDepartmentForm.name = this.departmentData[id].name
					this.lookDepartmentForm.intro = this.departmentData[id].remark
				} else if (this.current == 2) {
					// console.log("-------");
					// console.log(this.lookJobForm);
					this.lookJobForm.name = this.jobData[id].name
					this.lookJobForm.intro = this.jobData[id].remark
				} else {
					// console.log("-------");
					// console.log(this.lookMessgaForm);
					this.lookMessgaForm.title = this.messgaData[id].title
					this.lookMessgaForm.content = this.messgaData[id].content
				}

			},
			onLook(id) {
				this.showLook = true
				this.actionType = 3
				this.lookId = id

			},
			//删除用户信息
			onDelete(username) {
				this.deleteItem = username,
					this.ensureDelete = true
					// console.log(this.deleteItem)
			},

			cancelItem() {
				this.ensureDelete = false
			},
			async ensureDeleteItem() {
				let username = this.deleteItem
				let url = ''
				switch (this.current) {
					case 0:
						url = "user/remove/" + username
						break;
					case 1:
						url = "dept/remove/" + username

						break;

					case 2:
						url = "job/remove/" + username

						break;
					case 3:
						url = "notice/remove/" + username
						break;
				}

				let res = await this.$myRequest({
					url,
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					method: 'DELETE',
					data: {}
				});

				uni.showToast({
					title: "删除成功"
				})
				// console.log(res);

				switch (this.current) {
					case 0:
						this.skip = 0
						this.staffData = []
						this.getUserList(true) //初始化
						break;
					case 1:
						this.skip = 0
						this.departmentData = []
						this.getDeptList(true);
						break;
					case 2:
						this.skip = 0
						this.jobData = []
						this.jobSelector = ['全选']
						this.jobSelector2 = []
						this.getJobList(true)
						break;
					case 3:
						this.skip = 0
						this.messgaData = []
						this.getNoticeList(true)
						break;
				}
				this.ensureDelete = false,
					this.showLook = false
			},
			async submit(type) {

				// console.log("-------");
				// console.log(type);
				let data = {}
				let url = '';
				switch (this.current) {
					case 0:
						// console.log("----lookStaffForm---");
						// console.log(this.lookStaffForm);
						url = type == 'add' ? 'user/add_user' : 'user/update/' + this.lookStaffForm.username

						let {
							username, pwd, name, sex, job, phone, department, status,
							post_code, qq_num, email, party, education, remark, card_id, address,
							birthday, nation, speciality, hobby
						} = this.lookStaffForm;
						// console.log(this.sendMessaga)
						data = {
							"username": username,
							"status": status,
							"name": name,
							"sex": sex == '男' ? 1 : 2,
							"job": job,
							"department": department,
							"card_id": card_id
						}
						
						// console.log("----sdsds----")
								// console.log(this.sendMessaga)
								// console.log("--------")
						if (pwd == "" || pwd == null) {} else {
							data.password =  md5.hex_md5(pwd)
						}
						if (qq_num == null || qq_num == '') {} else {
							data.qq_num = qq_num
						}
						if (email == null || email == '') {} else {
							data.email = email
						}
						if (post_code == null || post_code == '') {} else {
							data.post_code = post_code
						}
						if (party == null || party == '') {} else {
							data.party = party
						}
						if (phone == null || phone == '') {} else {
							data.phone = phone
						}
						if (hobby == null || hobby == '') {} else {
							data.hobby = hobby
						}
						if (speciality == null || speciality == '') {} else {
							data.speciality = speciality
						}
						if (nation == undefined || nation == '' || nation == null) {} else {
							data.nation = nation
						}
						if (remark == null || remark == '') {} else {
							data.remark = remark
						}
						if (education == null || education == '') {} else {
							data.education = education
						}
						if (birthday == null || birthday == '') {} else {
							data.birthday = birthday
						}
						if (address == null || address == '') {} else {
							data.address = address
						}

						// data.username= username
						// data.status= status
						// data.name= name
						// data.job= job
						// data.department= department
						// data.card_id= card_id
						// data.sex=sex == '男' ? 1 : 2

						if (!username || !name || !sex || !job || !department || !card_id || !status) {
							uni.showToast({
								title: '带红星项不能留空哦',
								icon: 'none'
							})
							return
						}
						if (!/[0123456789]{11}/.test(phone) && !(phone == "") && !(phone == null)) {
							uni.showToast({
								title: '请输入正确手机号',
								icon: 'none'
							})
							return
						}
						if (!/[0123456789]{8}/.test(username)) {
							uni.showToast({
								title: '请输入正确工号',
								icon: 'none'
							})
							return
						}
						if (qq_num != '' && !/[0123456789]/.test(qq_num) && !(qq_num == "") && !(qq_num == null)) {
							uni.showToast({
								title: '请输入正确QQ号',
								icon: 'none'
							})
							return
						}
						

						if(!/^[0-9]{6}$/.test(post_code)&& !(post_code == null)&& !(post_code == "")){
							uni.showToast({
								title: '请输入正确邮编',
								icon: 'none'
							})
							return
						}
						
						if (!RegExp(
								/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
							).test(email) && !(email == "") && !(email == null)) {
							uni.showToast({
								title: '请输入正确邮箱',
								icon: 'none'
							})
							return
						}
						let reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

						if (!reg.test(card_id)) {
							uni.showToast({
								title: '请输入正确身份证号码',
								icon: 'none'
							})
							return
						}

						if (job == '未定') {
							uni.showToast({
								title: '职位不能为未定',
								icon: 'none'
							})
							return
						}
						if (department == '未定') {
							uni.showToast({
								title: '部门不能为未定',
								icon: 'none'
							})
							return
						}

						if (this.lookStaffForm.status == '全选') {

						} else if (this.lookStaffForm.status == '管理员') {
							data.status = 1
						} else {
							data.status = 2
						}
						if (this.searchData.staff) {
							data.username = this.searchData.staff
						}
						break;
					case 1:
						// console.log("--lookDepartmentForm-----");
						url = type == 'add' ? 'dept/add' : 'dept/update/' + this.departmentData[this.lookId].name
						let {
							intro, name: name1
						} = this.lookDepartmentForm;
						if (!name1) {
							uni.showToast({
								title: '部门名称不能留空哦',
								icon: 'none'
							})
							return
						}

						data = {
							"name": name1
						}
						if (intro == "" || intro == null) {} else {
							data.remark = intro
						}
						break;

					case 2:
						// console.log("lookJobForm");
						// console.log(this.lookJobForm);

						url = type == 'add' ? 'job/add' : 'job/update/' + this.jobData[this.lookId].name

						if (!this.lookJobForm.name) {
							uni.showToast({
								title: '职位名称不能留空哦',
								icon: 'none'
							})
							return
						}
						data = {
							// intro: this.lookJobForm.intro,
							"name": this.lookJobForm.name
						}
						if (this.lookJobForm.intro == "" || this.lookJobForm.intro == null) {} else {
							data.intro = this.lookJobForm.intro
						}
						break;

					case 3:
						// console.log("lookMessgaForm");
						// console.log(this.lookMessgaForm);
						url = 'notice/add'
						url = type == 'add' ? 'notice/add' : 'notice/update/' + this.messgaData[this.lookId].title
						let {
							content, title
						} = this.lookMessgaForm;
						if (!content || !title) {
							uni.showToast({
								title: '不能留空哦',
								icon: 'none'
							})
							return
						}
						
						data = {
							"username": this.userInfo.username,
							"content": this.lookMessgaForm.content,
							// "title":this.lookMessgaForm.title
							"title": this.lookMessgaForm.title,
							"notice_it":this.sendMessaga
						}
						break;
				}
				
				let dataSend={};
				if(type!= 'add'&&this.current==0){

					dataSend.user=data,
					dataSend.notice_it=this.sendMessaga
					
				}else{
					dataSend=data
				};

				let res = await this.$myRequest({
					url: url,
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					method: type == 'add' ? 'POST' : 'PUT',
					data:dataSend
				});
				// console.log(dataSend)
				// console.log(res);
				if (res == 'success' || res.create_time) {
					if (type == 'add') {
						uni.showToast({
							title: '添加成功'
						})
					} else {
						uni.showToast({
							title: '修改成功'
						})
					}

					switch (this.current) {
						case 0:
							this.staffData = []
							this.skip = 0;
							this.getUserList(true)
							break;

						case 1:
							this.departmentData = []
							this.departmentSelector = ['全选']
							this.departmentSelector2 = []
							this.skip = 0;
							this.getDeptList(true)
							break;
						case 2:
							this.jobData = []
							this.jobSelector = ['全选']
							this.jobSelector2 = []
							this.skip = 0;
							this.getJobList(true)
							break;
						case 3:
							this.messgaData = []
							this.skip = 0;
							this.getNoticeList(true)
							break;
					}
				}

				this.showAdd = false;
				this.showEdit = false
			},

			async getDeptList(init) {
				let url = '';
				if (init || !this.searchData.department) {
					url = 'dept/get-all';
				} else {
					url = 'dept/get/' + this.searchData.department
				}
				let res = await this.$myRequest({
					// url: 'job/get/' + this.searchData.job || '',
					url,
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					method: 'GET',
					data: {
						// name:'123',
						limit: this.limit,
						skip: this.skip
					}
				});
				// console.log(res);

				if (res && res.length > 0) {
					res.forEach(item => {
						this.departmentData.push(item)
						this.departmentSelector.push(item.name)
						this.departmentSelector2.push(item.name)
					})

					this.skip = (this.skip + 9);
					this.limit = (this.limit + 9);
				} else {

					uni.showToast({
						title: res.detail || '没有数据了',
						icon: 'none'
					})
				}

			},
			async getJobList(init) {

				let url = '';
				if (init || !this.searchData.job) {
					url = 'job/get-all';
				} else {
					url = 'job/get/' + this.searchData.job
				}
				let res = await this.$myRequest({
					url,
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					method: 'GET',
					data: {
						// name:'123',
						limit: this.limit,
						skip: this.skip
					}
				});
				// console.log(this.skip);

				if (res && res.length > 0) {

					res.forEach(item => {
						this.jobData.push(item);
						this.jobSelector.push(item.name)
						this.jobSelector2.push(item.name)
					})

					this.skip = (this.skip + 9);
					this.limit = (this.limit + 9);
				} else {

					uni.showToast({
						title: res.detail || '没有数据了',
						icon: 'none'
					})
				}
			},
			async getNoticeList(init) {
				let url = '';
				if (init || !this.searchData.messga) {
					url = 'notice/get-all';
				} else {
					url = 'notice/get/' + this.searchData.messga
				}
				
				let res = await this.$myRequest({
					url,
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					method: 'GET',
					data: {
						// name:'123',
						limit: this.limit,
						skip: this.skip,
					}
					
				});
				// console.log(this.skip);

				if (res && res.length > 0) {
					// console.log("-------");
					// console.log(res);
					res.forEach(item => {
						item.create_time = item.create_time.replace("T", " ");
						this.messgaData.push(item)
					})

					this.skip = (this.skip + 9);
					this.limit = (this.limit + 9);
				} else {

					uni.showToast({
						title: res.detail || '没有数据了',
						icon: 'none'
					})
				}

			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (index == this.current) return;
				this.current = index;
				this.skip = 0;
				this.searchData = {
					staff: '',
					job: '',
					messga: '',
					department: ''
				}
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;

				switch (this.current) {
					case 0:
						this.staffData = []
						this.getUserList(true) //true 代表初始化 查所有数据
						break;
					case 1:
						this.departmentData = []
						this.departmentSelector = ['全选']
						this.departmentSelector2 = []
						this.getDeptList(true); //true 代表初始化 查所有数据
						break;
					case 2:
						this.jobData = []
						this.jobSelector = ['全选']
						this.jobSelector2 = []
						this.getJobList(true) //true 代表初始化 查所有数据
						break;
					case 3:
						this.messgaData = [];
						this.getNoticeList(true) //true 代表初始化 查所有数据
						break;

				}



			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss">
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
		background-image: -webkit-linear-gradient(bottom, #ffffff, #cbe0fc);
	}

	.u-search-box {
		padding-bottom: 30rpx;
		border-bottom: 1px solid #e6e6e6;
		position: sticky;
		top: 0rpx;
		background-color: #eef5fe;
		z-index: 1;
	}

	.Selector {
		display: flex;
		font-size: 30rpx;
		font-weight: bold;
		border-radius: 10rpx;
		background-color: #eef5fe;
	}

	.Selector2 {
		width: 240rpx;
		height: 60rpx;
		margin-top: 45rpx;
		line-height: 60rpx;
		text-indent: 25rpx;
		border-radius: 10rpx;
		border: 1rpx solid #c0c0c0;
		background-color: #eef5fe;
	}

	.Selector3 {
		width: 240rpx;
		height: 60rpx;
		margin-top: 45rpx;
		margin-left: 45rpx;
		line-height: 60rpx;
		text-indent: 25rpx;
		border-radius: 10rpx;
		border: 1rpx solid #c0c0c0;
		background-color: #eef5fe;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #ddecff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		line-height: 1;
		border-right: 1px solid #e5e5e5;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 35rpx;
		font-weight: bold;
		background: #e2dfdf;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid #2979ff;
		height: 60rpx;
		left: 0;
		top: 27rpx;
	}

	.u-tab-view {
		height: 100%;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #eef5fe;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.list-box {
		border-bottom: 1px solid #e5e5e5;
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 10rpx 0;
		font-size: 35rpx;
		font-weight: bold;
	}

	.item-content {
		font-size: 35rpx;
		margin-top: 30rpx;
		margin-left: 20rpx;
		line-height: 60rpx;
	}

	.btn-box {
		text-align: right;
		margin-top: 40rpx;

		button {
			margin-left: 20rpx;
		}
	}

	.btn2-box {
		width: 550rpx;
		margin-top: 0rpx;
		margin-bottom: 20rpx;
		display: flex;
		line-height: 0rpx;
		justify-content: space-around;

		button {}
	}

	.add-btn {
		position: fixed;
		bottom: 180rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: #2979ff;
		color: white;
		font-size: 35rpx;
		line-height: 105rpx;
		text-align: center;
		transition-duration: 0.4s;
		font-weight: bold;
		border: 2px solid #2979ff;
	}

	.add-btn:hover {
		background-color: white;
		color: #2979ff;

	}

	.look-btn {
		margin-right: 50rpx;
		margin-left: 50rpx;
		height: 60rpx;
		width: 200rpx;
		text-align: center;
		line-height: 66rpx;
	}

	.popup-content {
		height: 50rpx;
		margin: 20rpx 20rpx;
		font-size: 45rpx;
		line-height: 60rpx;

		button {
			width: 100%;
			margin-top: 40rpx;
			border-radius: 10rpx;
			font-size: 35rpx;
		}
	}

	.popup-content2 {
		height: 600rpx;
	}

	.btn3-box {
		display: flex;
		height: 100rpx;
		justify-content: space-around;
		align-items: flex-end;
	}

	.popup-content1 {
		margin: 70rpx 60rpx;
		width: 480rpx;
		height: 300rpx;
		font-size: 40rpx;
		line-height: 60rpx;

		button {
			width: 100%;
			margin-top: 10rpx;
			border-radius: 10rpx;
			font-size: 35rpx;
		}
	}

	.content-box {
		width: 500rpx;
		// height: 200rpx;
		font-size: 36rpx;
	}


	.content-box1 {
		width: 500rpx;
		height: 500rpx;
		font-size: 40rpx;
		padding: 40rpx 20rpx;
		line-height: 60rpx;
	}
</style>
