import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class FsxnStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSM IAM Role
    const ssmIamRole = new cdk.aws_iam.Role(this, "SSM IAM Role", {
      assumedBy: new cdk.aws_iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
      ],
    });

    // VPC
    const vpc = new cdk.aws_ec2.Vpc(this, "VPC", {
      cidr: "10.0.1.0/24",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 0,
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
          cidrMask: 26,
        },
        {
          name: "Isolated",
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 26,
        },
      ],
    });

    // Security Group used by FSx for ONTAP file system
    const fileSystemSecurityGroup = new cdk.aws_ec2.SecurityGroup(
      this,
      "Security Group of FSx for ONTAP file system",
      {
        vpc,
      }
    );

    // Ref : https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/limit-access-security-groups.html
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.icmpPing(),
      "Pinging the instance"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(22),
      "SSH access to the IP address of the cluster management LIF or a node management LIF"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(111),
      "Remote procedure call for NFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(135),
      "Remote procedure call for CIFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(139),
      "NetBIOS service session for CIFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcpRange(161, 162),
      "Simple network management protocol (SNMP)"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(443),
      "ONTAP REST API access to the IP address of the cluster management LIF or an SVM management LIF"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(445),
      "Microsoft SMB/CIFS over TCP with NetBIOS framing"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(635),
      "NFS mount"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(749),
      "Kerberos"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(2049),
      "NFS server daemon"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(3260),
      "iSCSI access through the iSCSI data LIF"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(4045),
      "NFS lock daemon"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(4046),
      "Network status monitor for NFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(10000),
      "Network data management protocol (NDMP) and NetApp SnapMirror intercluster communication"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(11104),
      "Management of NetApp SnapMirror intercluster communication"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.tcp(11105),
      "SnapMirror data transfer using intercluster LIFs"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(111),
      "Remote procedure call for NFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(135),
      "Remote procedure call for CIFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(137),
      "NetBIOS name resolution for CIFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(139),
      "NetBIOS service session for CIFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udpRange(161, 162),
      "Simple network management protocol (SNMP)"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(635),
      "NFS mount"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(2049),
      "NFS server daemon"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(4045),
      "NFS lock daemon"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(4046),
      "Network status monitor for NFS"
    );
    fileSystemSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(vpc.vpcCidrBlock),
      cdk.aws_ec2.Port.udp(4049),
      "NFS quota protocol"
    );

    const addcSecurityGroup = new cdk.aws_ec2.SecurityGroup(
      this,
      "Security Group of AD DC",
      {
        vpc,
      }
    );

    addcSecurityGroup.addIngressRule(
      cdk.aws_ec2.Peer.securityGroupId(fileSystemSecurityGroup.securityGroupId),
      cdk.aws_ec2.Port.allTraffic()
    );

    // Secret of FSx for ONTAP file system
    const fileSystemSecret = new cdk.aws_secretsmanager.Secret(
      this,
      "Secret of FSx for ONTAP file system",
      {
        secretName: "/fsx-for-ontap/file-system/fsxadmin",
        generateSecretString: {
          generateStringKey: "password",
          passwordLength: 32,
          requireEachIncludedType: true,
          secretStringTemplate: '{"username": "fsxadmin"}',
        },
      }
    );

    // FSx for ONTAP file system
    const fsxForOntapFileSystem = new cdk.aws_fsx.CfnFileSystem(
      this,
      "FSx for ONTAP file system",
      {
        fileSystemType: "ONTAP",
        subnetIds: vpc.selectSubnets({
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
        }).subnetIds,
        ontapConfiguration: {
          deploymentType: "SINGLE_AZ_1",
          automaticBackupRetentionDays: 7,
          dailyAutomaticBackupStartTime: "16:00",
          diskIopsConfiguration: {
            mode: "AUTOMATIC",
          },
          fsxAdminPassword: new cdk.CfnDynamicReference(
            cdk.CfnDynamicReferenceService.SECRETS_MANAGER,
            `${fileSystemSecret.secretArn}:SecretString:password`
          ).toString(),
          throughputCapacity: 128,
          weeklyMaintenanceStartTime: "6:17:00",
        },
        securityGroupIds: [fileSystemSecurityGroup.securityGroupId],
        storageCapacity: 1024,
        storageType: "SSD",
        tags: [
          {
            key: "Name",
            value: "fsx-for-ontap-file-system",
          },
        ],
      }
    );
  }
}
